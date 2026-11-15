import { useRef, useState } from 'react';
import type { MemoryNote, Persona } from '../data/types';
import { useToast } from '../design-system/components/Toast/toastContext';

type Memory = Persona['memory'];
type Kind = keyof Memory;

export function useMemory(
  initial: Memory,
  idPrefix: string,
  onUndo: (restore: () => void, id?: string) => void,
) {
  const [memory, setMemory] = useState(initial);
  const sequence = useRef(0);
  const { showToast } = useToast();

  function save(
    updated: Memory,
    title: string,
    description?: string,
    restoreId?: string,
  ) {
    const previous = memory;
    setMemory(updated);
    showToast({
      title,
      description,
      onUndo: () => onUndo(() => setMemory(previous), restoreId),
    });
  }

  function add(text: string) {
    const note: MemoryNote = {
      id: idPrefix + '-instruction-' + ++sequence.current,
      text,
      meta: 'Added today',
    };
    save(
      { ...memory, instructions: [...memory.instructions, note] },
      'Saved as your instruction.',
      'Glance follows it from the next email.',
    );
  }

  function edit(kind: Kind, id: string, text: string) {
    if (kind === 'instructions') {
      save(
        {
          ...memory,
          instructions: memory.instructions.map((note) =>
            note.id === id ? { ...note, text } : note,
          ),
        },
        'Saved.',
        undefined,
        id,
      );
      return;
    }
    save(
      {
        instructions: [
          ...memory.instructions,
          { id, text, meta: 'Was learned · edited just now' },
        ],
        learned: memory.learned.filter((note) => note.id !== id),
      },
      'Saved as your instruction.',
      'Your instructions always win.',
      id,
    );
  }

  function remove(kind: Kind, id: string) {
    save(
      { ...memory, [kind]: memory[kind].filter((note) => note.id !== id) },
      'Removed from Memory.',
      undefined,
      id,
    );
  }

  return { memory, add, edit, remove };
}
