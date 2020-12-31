import { useState } from "react"

import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogTitle from "@material-ui/core/DialogTitle"
import TextField from "@material-ui/core/TextField"

interface Props {
  closePopup: () => void
}

const LoginForm = ({ closePopup }: Props) => {
  const [token, setToken] = useState("")
  const [pin, setPin] = useState("")

  function handleLogin() {
    console.log("Calling auth service")
  }

  return (
    <Dialog open={true}>
      <DialogTitle>Login</DialogTitle>
      <DialogContent>
        <DialogContentText>
          If you've been given authorization, please enter the credentials below:
        </DialogContentText>
      </DialogContent>
      <TextField
        autoFocus
        margin="dense"
        name="token"
        id="token"
        label="Token"
        type="text"
        onChange={(e) => setToken(e.target.value)}
        value={token}
        fullWidth
      />
      <TextField
        margin="dense"
        name="pin"
        id="pin"
        label="Pin"
        type="password"
        onChange={(e) => setPin(e.target.value)}
        value={pin}
        fullWidth
      />
      <DialogActions>
        <Button onClick={closePopup} color="primary">
          Cancel
        </Button>
        <Button onClick={handleLogin} color="primary">
          Login
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default LoginForm
