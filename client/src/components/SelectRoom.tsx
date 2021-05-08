import React, { useEffect, useState } from "react";

import type AuthService from "services/AuthService";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  makeStyles,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@material-ui/core";

type RoomQueried = {
  name: string;
  accessCode: string;
};

type Props = {
  auth: AuthService;
  updateRoom: Function;
};

const useStyles = makeStyles({
  actions: {
    justifyContent: "left",
  },
});

function SelectRoom(props: Props) {
  const classes = useStyles();

  const defaultSelectable: RoomQueried[] = [];
  const [open, setOpen] = useState(false);
  const [selectableRooms, setSelectableRooms] = useState(defaultSelectable);
  const [convention, setConvention] = useState(1);
  const [per, setPer] = useState(10);
  const [page, setPage] = useState(0);

  useEffect(() => {
    props.auth.fetch(
      "/api/room/list/" + convention + "/" + per + "/" + page,
      {
        method: "GET",
      },
      (result: RoomQueried[], status: number) => {
        if (status < 400) {
          setSelectableRooms(result);
        }
      }
    );
  }, [props.auth, per, convention, page]);

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  return (
    <div>
      <Button onClick={handleClickOpen}>Select Room</Button>
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Select Room</DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table size="medium">
              <TableHead>
                <TableCell>Name</TableCell>
                <TableCell>Access Code</TableCell>
              </TableHead>
              <TableBody>
                {selectableRooms.map((v, _i) => (
                  <TableRow>
                    <TableCell>{v.name}</TableCell>
                    <TableCell>{v.accessCode}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions className={classes.actions}>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default SelectRoom;
