import React, { useState } from "react";

import type AuthService from "services/AuthService";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  makeStyles,
} from "@material-ui/core";
import MaterialTable from "material-table";

import Check from "@material-ui/icons/Check";
import Close from "@material-ui/icons/Close";

type RoomQueried = {
  id: number;
  name: string;
  accessCode: string;
  concluded: boolean;
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

const columns = [
  { title: "Name", field: "name" },
  { title: "Access Code", field: "accessCode" },
  {
    title: "Concluded",
    field: "concluded",
    render: (rowData: RoomQueried) =>
      rowData.concluded ? <Check /> : <Close />,
  },
];

function SelectRoom(props: Props) {
  const classes = useStyles();

  const convention = 1;
  const [open, setOpen] = useState(false);

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
          <MaterialTable
            options={{
              showTitle: false,
              sorting: false,
              filtering: false,
            }}
            onRowClick={(_e, row) => {
              if (row != null && typeof row == "object") {
                props.updateRoom(row.id);
                handleClose();
              }
            }}
            columns={columns}
            data={(query) =>
              new Promise((resolve, _reject) => {
                let url =
                  "/api/room/list/" +
                  convention +
                  "/" +
                  query.pageSize +
                  "/" +
                  query.page;
                let params = {};
                if (query.search.length > 0) {
                  //@ts-ignore
                  params["search"] = query.search;
                }
                props.auth.fetch(
                  url + "?" + new URLSearchParams(Object.entries(params)),
                  { method: "GET" },
                  (
                    result: { rooms: RoomQueried[]; count: number },
                    status: number
                  ) => {
                    if (status >= 400)
                      throw new Error("Failed to get room query for table");
                    resolve({
                      data: result.rooms,
                      page: query.page,
                      totalCount: result.count,
                    });
                  }
                );
              })
            }
          />
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
