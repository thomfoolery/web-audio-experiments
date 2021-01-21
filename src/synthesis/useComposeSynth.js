import {useMemo} from 'react';
import createNoiseSource from './createNoiseSource';

function useComposeSynth(audioContext, destination, patch) {
  return useMemo(() => {
    const masterGain = audioContext.createGain();

    let nodes;
    let sources;
    let controls;
    let effects;
    let noteGain;
    let maxRelease;
    let context = {};

    masterGain.connect(destination);

    function playNote(frequency, time = audioContext.currentTime, hold) {
      noteGain = audioContext.createGain();
      nodes = patch.nodes.map(node => {
        const {type} = node;

        switch (type) {
          case 'DESTINATION':
            return {
              ...node,
              audioNode: noteGain,
            };
          case 'CONTROL':
            return node.data.type === 'LFO'
              ? {
                  ...node,
                  audioNode: createAudioNode(audioContext, node),
                }
              : {
                  ...node,
                };
          default:
            return {
              ...node,
              audioNode: createAudioNode(audioContext, node),
            };
        }
      });

      const nodeHash = nodes.reduce((acc, node) => {
        acc[node.id] = node;
        return acc;
      }, {});

      sources = nodes.filter(({type}) => type === 'SOURCE');
      controls = nodes.filter(({type}) => type === 'CONTROL');
      effects = nodes.filter(({type}) => type === 'EFFECT');

      maxRelease = Math.max(
        ...controls.map(({data}) => data.params.release || 0),
      );

      patch.edges.forEach(({sourceId, targetId}) => {
        const source = nodeHash[sourceId];
        const target = nodeHash[targetId];

        if (source.type === 'CONTROL') {
          if (source.data.type === 'LFO') {
            if (target.data.type === 'GAINCTRL') {
              source.audioNode.connect(target.target[target.data.controlParam]);
            }
          }
          source.target = target.audioNode || target;
        } else {
          source.destination = target.audioNode;
          source.audioNode.connect(target.audioNode);
        }
      });

      noteGain.connect(masterGain);

      sources.forEach(node => {
        const {data, audioNode} = node;

        for (const param in data.params) {
          setParam(
            audioNode,
            param,
            data.params[param],
            audioContext.currentTime,
          );
        }

        if (audioNode.frequency) {
          audioNode.frequency.value = frequency;
        }
        audioNode.start(time);

        context[frequency] = true;

        if (hold) {
          stopNote(frequency, time + hold);
        }
      });

      controls.forEach(node => {
        const {target, data, audioNode} = node;
        const {controlParam} = data;

        if (node.data.type === 'ADSR') {
          const {attack, decay, sustain} = node.data.params;
          target[controlParam].setValueAtTime(0, audioContext.currentTime);
          target[controlParam].linearRampToValueAtTime(
            1,
            audioContext.currentTime + attack,
          );
          target[controlParam].linearRampToValueAtTime(
            sustain,
            audioContext.currentTime + attack + decay,
          );
        }
        if (node.data.type === 'LFO') {
          for (const param in data.params) {
            setParam(
              audioNode,
              param,
              data.params[param],
              audioContext.currentTime,
            );
          }
          audioNode.start(time);
        } else {
          for (const param in data.params) {
            setParam(
              target,
              param,
              data.params[param],
              audioContext.currentTime,
            );
          }
        }
      });

      effects.forEach(node => {
        const {data, audioNode} = node;
        for (const param in data.params) {
          setParam(
            audioNode,
            param,
            data.params[param],
            audioContext.currentTime,
          );
        }
      });
    }

    function stopNote(frequency, time = audioContext.currentTime) {
      if (context[frequency]) {
        controls.forEach(node => {
          const {target, data, audioNode} = node;
          const {controlParam} = data;

          if (data.type === 'ADSR') {
            const {release} = data.params;
            target[controlParam].linearRampToValueAtTime(
              0,
              audioContext.currentTime + release,
            );
          }
          if (node.data.type === 'LFO') {
            audioNode.stop(time + maxRelease);
          }
        });

        sources.forEach(({audioNode /*destination*/}) => {
          const fadeOutDuration = 1 / 1000; // 1ms
          // stop the pop
          noteGain.gain.setValueAtTime(noteGain.gain.value, time);
          noteGain.gain.linearRampToValueAtTime(
            0,
            time + maxRelease + fadeOutDuration,
          );
          audioNode.stop(time + maxRelease + fadeOutDuration);
        });
      }

      delete context[frequency];
    }

    return {
      playNote,
      stopNote,
      context,
      masterGain,
      audioContext,
    };
  }, [audioContext, destination, patch]);
}

function setParam(object, param, value, time) {
  if (object[param] instanceof AudioParam) {
    object[param].setValueAtTime(value, time);
  } else {
    object[param] = value;
  }
}

function createAudioNode(audioContext, node) {
  const {data} = node;

  switch (data.type) {
    case 'OSCILLATOR':
    case 'LFO': {
      return audioContext.createOscillator();
    }
    case 'GAIN': {
      return audioContext.createGain();
    }
    case 'NOISE': {
      return createNoiseSource(audioContext);
    }
    case 'FILTER': {
      return audioContext.createBiquadFilter();
    }
    default:
      return null;
  }
}

export default useComposeSynth;
