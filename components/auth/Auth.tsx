import { useState, FC } from 'react';
import { Container, Collapse, Paper, Avatar, TextField, Button, Typography, makeStyles } from '@material-ui/core';
import { Alert } from '@material-ui/lab'
import LockIcon from '@material-ui/icons/LockOutlined';
import { useMutation } from '@apollo/react-hooks';
import { REGISTER, LOGIN } from '../../gql/queries/auth';
import { formatCredReq, formatAssertReq } from './helpers/index';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: '32px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '16px'
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  submit: {
    margin: theme.spacing(1, 0, 1),
  },
}));

const Auth: FC = () => {
  const classes = useStyles();
  const [username, setUsername] = useState('');
  const [error, setError] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [register] = useMutation(REGISTER);
  const [login] = useMutation(LOGIN);

  const handleRegister = async() => {
    register({
      variables: {
        username
      }
    })
    .then(({data}) => {
      const { status, message, credential } = data.register;
      if(status !== 'ok')
        throw new Error(message);
      const publicKey = formatCredReq(credential);
      return navigator.credentials.create({publicKey});
    })
    .then(response => {
      console.log(response);
    })
    .catch(err => {
      console.log(err);
      setErrMsg(err.message)
      setError(true);
    })
  };

  const handleLogin = async() => {
    login({
      variables: {
        username
      }
    }).then(({data}) => {
      const { status, message, assertion } = data.login;
      if(status !== 'ok')
        throw new Error(message);
      console.log(assertion);
      const publicKey = formatAssertReq(assertion);
      console.log(publicKey);
      return navigator.credentials.get({publicKey});
    })
    .then(response => {
      console.log(response);
    })
    .catch(err => {
      console.log(err);
      setErrMsg(err.message);
      setError(true);
    })
  }

  return(
    <Container maxWidth='sm'>
        <Collapse in={error}>
          <Alert severity="error" onClose={() => {setError(false)}}>
            {errMsg}
          </Alert>
        </Collapse>
      <Paper variant='elevation' elevation={3} className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockIcon/>
        </Avatar>
        <Typography component='h1' variant='h5'>
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
          variant='contained'
          color='primary'
          className={classes.submit}
          disabled={!username}
          onClick={handleLogin}
        >
          Log in
        </Button>
        <Button
          fullWidth
          variant='contained'
          color='primary'
          className={classes.submit}
          disabled={!username}
          onClick={handleRegister}
        >
          Register
        </Button>
      </Paper>
    </Container>
  )
}

export default Auth;
