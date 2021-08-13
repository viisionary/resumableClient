import {
  createStyles,
  TableCell,
  TableRow,
  withStyles
} from "@material-ui/core";

export const StyledTableCell = withStyles((theme) =>
  createStyles({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white
    },
    body: {
      fontSize: 14
    }
  })
)(TableCell);
export const StyledTableRow = withStyles((theme) =>
  createStyles({
    root: {
      width: "100%",
      "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.action.hover
      }
    }
  })
)(TableRow);
