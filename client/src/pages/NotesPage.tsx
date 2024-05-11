import { Container } from 'react-bootstrap';
import styles from '../styles/NotesPage.module.css';
import { User } from '../types';
import NotesPageLoggedInView from '../components/Notes/NotesPageLoggedInView';
import NotesPageLoggedOutView from '../components/Notes/NotesPageLoggedOutView';

interface NotesPageProps {
  loggedInUser: User | null;
}

const NotesPage = ({ loggedInUser }: NotesPageProps) => {
  return (
    <Container className={styles.notesPage}>
      <>
        {loggedInUser ? <NotesPageLoggedInView /> : <NotesPageLoggedOutView />}
      </>
    </Container>
  );
};

export default NotesPage;
