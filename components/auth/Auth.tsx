import { useState, useEffect, FC } from 'react';
import {
  Container,
  Collapse,
  Paper,
  Avatar,
  TextField,
  Button,
  Typography,
  makeStyles,
  CircularProgress,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import LockIcon from '@material-ui/icons/LockOutlined';
import { useRouter } from 'next/router';
import { useAuth } from '../../auth/hooks/useAuth';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: '32px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '16px',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  submit: {
    margin: theme.spacing(1, 0, 1),
    height: '40px',
    color: 'white',
  },
}));

const Auth: FC = () => {
  const classes = useStyles();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [state, setState] = useState({
    err: false,
    errMsg: '',
    success: false,
    successMsg: '',
    loading: false,
  });
  const { login, register, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) router.push('/courses');
  }, [isAuthenticated]);

  const handleRegister = async () => {
    setState({
      ...state,
      loading: true,
    });
    register(username)
      .then(() =>
        setState({
          err: false,
          errMsg: '',
          success: true,
          successMsg: 'Registration successful, you can log in now.',
          loading: false,
        })
      )
      .catch((err) => {
        setState({
          ...state,
          err: true,
          errMsg: err.message,
          loading: false,
        });
      });
  };

  const handleLogin = async () => {
    setState({
      ...state,
      loading: true,
    });
    login(username)
      .then(() => {
        setState({
          ...state,
          loading: false,
        });
        router.push('/').then(() => router.reload());
      })
      .catch((err) => {
        setState({
          ...state,
          err: true,
          errMsg: err.message,
          loading: false,
        });
      });
  };
  const handleAlertClose = () =>
    setState({
      ...state,
      err: false,
      errMsg: '',
      success: false,
      successMsg: '',
    });

  return (
    <Container maxWidth="sm" style={{ marginTop: '64px' }}>
      <Collapse in={state.err}>
        <Alert severity="error" onClose={handleAlertClose}>
          {state.errMsg}
        </Alert>
      </Collapse>
      <Collapse in={state.success}>
        <Alert severity="success" onClose={handleAlertClose}>
          {state.successMsg}
        </Alert>
      </Collapse>
      <Paper variant="elevation" elevation={3} className={classes.paper}>
        <Avatar className={classes.avatar}>
          {state.loading ? (
            <CircularProgress color="inherit" disableShrink size={35} />
          ) : (
            <LockIcon />
          )}
        </Avatar>
        <Typography component="h1" variant="h5">
          Log in
        </Typography>
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          id="username"
          label="Username"
          name="username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <Button
          fullWidth
          variant="contained"
          color="secondary"
          className={classes.submit}
          disabled={!username}
          onClick={handleLogin}
        >
          Log in
        </Button>
        <Button
          fullWidth
          variant="contained"
          color="secondary"
          className={classes.submit}
          disabled={!username}
          onClick={handleRegister}
        >
          Register
        </Button>
      </Paper>
    </Container>
  );
};

export default Auth;
