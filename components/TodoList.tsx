import { useState, useEffect } from 'react';
import { TrashIcon, CheckIcon } from '@radix-ui/react-icons';
import { supabase } from '../lib/initSupabase';
import { styled } from '../stitches.config';
import { Text } from './Text';

const Button = styled('button', {
  backgroundColor: '$sage12',
  color: '$blue8',
});

const IconButton = styled(Button, {
  borderRadius: '$round',
  color: '$sage12',
  padding: '$0',
  border: 'none',
  background: '$sage2',
  square: 36,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: '$normal',
  '&:hover': {
    background: '$sage3',
  },
});

export default function Todos({ user }) {
  const [todos, setTodos] = useState([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [errorText, setError] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    let { data: todos, error } = await supabase
      .from('todos')
      .select('*')
      .order('id', true);
    if (error) console.log('error', error);
    else setTodos(todos);
  };
  const addTodo = async (taskText) => {
    let task = taskText.trim();
    if (task.length) {
      let { data: todo, error } = await supabase
        .from('todos')
        .insert({ task, user_id: user.id })
        .single();
      if (error) setError(error.message);
      else setTodos([...todos, todo]);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await supabase.from('todos').delete().eq('id', id);
      setTodos(todos.filter((x) => x.id != id));
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <div>
      <Text.Heading3>Notes</Text.Heading3>
      <Text.Heading4>Never forget anything ever</Text.Heading4>
      <div>
        <input
          type="text"
          placeholder="make coffee"
          value={newTaskText}
          onChange={(e) => {
            setError('');
            setNewTaskText(e.target.value);
          }}
        />
        <Button onClick={() => addTodo(newTaskText)}>Add</Button>
      </div>
      {!!errorText && <Alert text={errorText} />}
      <div>
        <ul>
          {todos.map((todo) => (
            <Todo
              key={todo.id}
              todo={todo}
              onDelete={() => deleteTodo(todo.id)}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

const NoteItem = styled('li', {});

const Todo = ({ todo, onDelete }) => {
  const [isCompleted, setIsCompleted] = useState(todo.is_complete);

  const toggle = async () => {
    try {
      const { data, error } = await supabase
        .from('todos')
        .update({ is_complete: !isCompleted })
        .eq('id', todo.id)
        .single();
      if (error) {
        throw new Error(error);
      }
      setIsCompleted(data.is_complete);
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <NoteItem>
      <Text>{todo.task}</Text>
      {!isCompleted ? (
        <IconButton onClick={(e) => toggle()}>
          <CheckIcon />
        </IconButton>
      ) : (
        <IconButton
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete();
          }}
        >
          <TrashIcon />
        </IconButton>
      )}
    </NoteItem>
  );
};

const Alert = ({ text }) => <div>{text}</div>;
