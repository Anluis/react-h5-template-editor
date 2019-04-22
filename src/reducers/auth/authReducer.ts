import { AuthState, AuthAction } from '../../types/auth'
import { UPDATE_AUTH } from '../../constants/ActionTypes';

type Action = AuthAction

type State = AuthState

const initState: AuthState = {
  accessToken: '',
  isAuthenticated: false
}

const authReducer = (state: State = initState, action: Action): State => {
  switch (action.type) {
    case UPDATE_AUTH:
      return state
    default:
      return state
  }
}

export default authReducer