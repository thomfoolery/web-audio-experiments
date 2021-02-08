import {useMemo} from 'react';
import createNoiseSource from './createNoiseSource';

function useComposeSynth(audioContext, destination) {
  return useMemo(() => {
    const masterGain = audioContext.createGain();

    let patch;
    let memory = {notes: []};

    masterGain.connect(destination);

    function playNote(frequency, time = audioContext.currentTime, hold) {
      const noteGain = audioContext.createGain();
      const nodes = patch.nodes.map(node => {
        const {type} = node;

        switch (type) {
          case 'DESTINATION':
            return {
              ...node,
              audioNode: noteGain,
            };
          case 'CONTROL':
            switch (node.data.type) {
              case 'LFO':
                return {
                  ...node,
                  audioNode: createAudioNode(audioContext, node),
                };
              default:
                return {
                  ...node,
                };
            }
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

      const sources = nodes.filter(({type}) => type === 'SOURCE');
      const controls = nodes.filter(({type}) => type === 'CONTROL');
      const effects = nodes.filter(({type}) => type === 'EFFECT');

      const maxRelease = Math.max(
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

      memory.notes.push({
        nodes,
        sources,
        controls,
        effects,
        noteGain,
        maxRelease,
        frequency,
      });

      if (hold) {
        stopNote(frequency, time + hold);
      }
    }

    function stopNote(frequency, time = audioContext.currentTime) {
      const note = memory.notes.find(note => frequency === note.frequency);

      if (note) {
        const {sources, controls, noteGain, maxRelease} = note;

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

      memory.notes = memory.notes.filter(note => frequency !== note.frequency);
    }

    function setPatch(newPatch) {
      memory.notes.forEach(({frequency}) => stopNote(frequency));
      memory.notes = [];

      patch = newPatch;
    }

    return {
      playNote,
      stopNote,
      setPatch,
      masterGain,
      audioContext,
    };
  }, [audioContext, destination]);
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
