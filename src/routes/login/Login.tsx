import * as React from 'react'
import PropTypes from 'prop-types'
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles'
import { Button } from '@material-ui/core';
import { connect } from 'react-redux'
import TextField from '@material-ui/core/TextField'
import outstyles from './Login.module.css'
import IStoreState from '../../types/IStoreState'
import { ThunkDispatch } from 'redux-thunk'
import { login } from '../../actions/auth';
import { withRouter, RouteComponentProps, Redirect } from 'react-router-dom'
import Paper from '@material-ui/core/Paper';
import { setErrorMessage } from '../../actions/status';
import Fade from '@material-ui/core/Fade'
import Snackbar from '@material-ui/core/Snackbar'

const styles = (theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
    },
    dense: {
      marginTop: 16,
    },
    menu: {
      width: 200,
    },
  });

interface DispatchProps {
  login: (username: string, password: string) => Promise<void>
  clearError: () => void
}

export interface OwnProps extends WithStyles<typeof styles>, RouteComponentProps {
  isAuthenticated: boolean
  isLoading: boolean
  errorMessage: string
}

type Props = OwnProps & DispatchProps

interface State {
  userName: string
  passWord: string
  snackbarStatus: string
}

class Login extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      userName: '',
      passWord: '',
      snackbarStatus: ''
    }
  }

  componentDidMount() {
    const { isAuthenticated, clearError } = this.props
    clearError()
    if (isAuthenticated) {
      this.naviToEditor()
    }
  }

  handleChange = (name: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      [name]: event.target.value,
    } as Pick<State, keyof State>);
  };

  handleSubmit = async () => {
    try {
      const { login } = this.props
      await login(this.state.userName, this.state.passWord)
    } catch (err) {

    }
  }

  naviToEditor = () => {
    this.props.history.push({
      pathname: '/editor'
    })
  }

  handleClose = () => {
    this.setState({
      snackbarStatus: ''
    })
  }

  render() {
    const { isAuthenticated, errorMessage, classes } = this.props
    const { snackbarStatus } = this.state
    const isError = errorMessage !== '' ? true : false
    const isSnackBarOpen = isError
    return (
      <>
        <Snackbar
          open={isSnackBarOpen}
          onClose={this.handleClose}
          TransitionComponent={Fade}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">{errorMessage}</span>}
        />
        {isAuthenticated ?
          <Redirect to="/editor" />
          :
          <div className={outstyles.login}>
            <Paper>
              <form className={outstyles.dialog} noValidate autoComplete="off">
                <TextField
                  error={isError}
                  id="outlined-name"
                  label="Name"
                  className={classes.textField}
                  value={this.state.userName}
                  onChange={this.handleChange('userName')}
                  margin="normal"
                  variant="outlined"
                />
                <TextField
                  error={isError}
                  id="outlined-password-input"
                  label="Password"
                  className={classes.textField}
                  type="password"
                  onChange={this.handleChange('passWord')}
                  autoComplete="current-password"
                  margin="normal"
                  variant="outlined"
                />
                <Button variant="contained" color="primary" onClick={this.handleSubmit}>Login</Button>
              </form>
            </Paper>

          </div>}
      </>
    )

  }
}

(Login as React.ComponentClass<Props>).propTypes = {
  classes: PropTypes.object.isRequired,
} as any

const mapStateToProps = (state: IStoreState) => {
  const { isLoading, errorMessage } = state.status
  const { isAuthenticated } = state.auth
  return {
    isLoading,
    isAuthenticated,
    errorMessage
  }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, any>): DispatchProps => {
  return {
    login: async (username: string, password: string) => {
      dispatch(login(username, password))
    },
    clearError: () => {
      dispatch(setErrorMessage(''))
    }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Login)))