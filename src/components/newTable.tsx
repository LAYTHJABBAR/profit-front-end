import * as React from "react";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { visuallyHidden } from "@mui/utils";
import { Data } from "../models/data.model";
import { gql, useQuery } from "@apollo/client";
import {
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  styled,
} from "@mui/material";

const GET_DATA = gql`
  query GetPagDashboards(
    $filterBy: String
    $filterValue: String
    $page: Int
    $sortBy: String
  ) {
    getPagDashboards(
      filterBy: $filterBy
      filterValue: $filterValue
      page: $page
      sortBy: $sortBy
    ) {
      postalCodeNAN
      postalCodeFSA
      completedRevenue
      City
      completedJobs
      Street
      State
      ID
      Address
    }
  }
`;

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data | null;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "postalCodeFSA",
    numeric: false,
    disablePadding: false,
    label: "Postal Code FSA",
  },
  {
    id: "City",
    numeric: false,
    disablePadding: false,
    label: "City",
  },
  {
    id: "completedJobs",
    numeric: true,
    disablePadding: false,
    label: "Completed # of Jobs",
  },
  {
    id: "completedRevenue",
    numeric: true,
    disablePadding: false,
    label: "Completed Revenue",
  },
  {
    id: null,
    numeric: true,
    disablePadding: false,
    label: "Average Revenue Per Job",
  },
];

interface EnhancedTableProps {
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, rowCount, onRequestSort } = props;
  const createSortHandler = (property: keyof Data | null) => (
    event: React.MouseEvent<unknown>
  ) => {
    property ? onRequestSort(event, property) : null;
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
          >
            <TableSortLabel active={false}>
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function EnhancedTableToolbar(handleToolBar: any) {
  const [filterBy, setFilterBy] = React.useState("");
  const [filterValue, setFilterValue] = React.useState(null);

  const handleFilterByChange = (event: SelectChangeEvent) => {
    event.preventDefault();
    setFilterBy(event.target.value);
  };
  const handleFilterValue = (event: any) => {
    event.preventDefault();

    setFilterValue(event.target.value !== "" ? event.target.value : null);
  };
  const handleSearchButton = () => {
    handleToolBar.handleToolBar(filterBy, filterValue);
  };
  const handleResetButton = () => {
    handleToolBar.handleToolBar(null, null, true);
  };

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },

        bgcolor: (theme) =>
          alpha(
            theme.palette.primary.main,
            theme.palette.action.activatedOpacity
          ),
      }}
    >
      <FormControl sx={{ m: 1, minWidth: "20%" }} size="small">
        <InputLabel id="demo-select-small-label">Filter By</InputLabel>
        <Select
          labelId="demo-select-small-label"
          id="demo-select-small"
          value={filterBy}
          label="Filter By"
          onChange={handleFilterByChange}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={"postalCodeFSA"}>Postal Code FSA</MenuItem>
          <MenuItem value={"completedJobs"}>Completed # of Jobs</MenuItem>
          <MenuItem value={"City"}>City</MenuItem>
          <MenuItem value={"completedRevenue"}>Completed Revenue</MenuItem>
        </Select>
      </FormControl>
      <FormControl sx={{ m: 1, width: "40%" }}>
        <TextField
          hiddenLabel
          id="filled-hidden-label-small"
          defaultValue="Filter Value"
          variant="outlined"
          size="small"
          onChange={handleFilterValue}
        />
      </FormControl>
      <Button
        variant="contained"
        onClick={handleSearchButton}
        sx={{
          width: "10%",
          backgroundColor: "#18a68e",
          ":hover": {
            bgcolor: "black",
            color: "white",
          },
        }}
      >
        Search
      </Button>
      <Button
        variant="contained"
        onClick={handleResetButton}
        sx={{
          m: 1,
          width: "10%",
          backgroundColor: "#18a68e",
          ":hover": {
            bgcolor: "black",
            color: "white",
          },
        }}
      >
        Reset
      </Button>
      <Typography
        sx={{ flex: "1 1 100%" }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        Dashboard Table
      </Typography>
    </Toolbar>
  );
}

export default function EnhancedTable() {
  const [rows, setRows] = React.useState<Data[]>([]);
  const [filterBy, setFilterBy] = React.useState<string | null>(null);
  const [filterValue, setFilterValue] = React.useState<string | null>(null);
  const { data: data1, loading: loading1, error: error1, refetch } = useQuery(
    GET_DATA,
    {
      variables: {
        filterBy: filterBy,
        filterValue: filterValue,
        sortBy: null,
      },

      onCompleted: (data) => {
        setRows(data.getPagDashboards);
      },
    }
  );

  const handleToolBar = (
    filterByV: string,
    filterValueV: string,
    reset: boolean = false
  ) => {
    if (reset) {
      setRows([]);
      setTimeout(() => {
        refetch({
          filterBy: null,
          filterValue: null,
          page: 1,
        });
        setFilterBy(null);
        setFilterValue(null);
        setRows(data1.getPagDashboards);
      }, 1000);
    } else {
      setFilterBy(filterByV);
      setFilterValue(filterValueV);
      refetch({
        filterBy: filterByV,
        filterValue: filterValueV,
      });
    }
  };
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof Data>("City");

  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    if (filterBy && filterValue) {
      return;
    } else {
      refetch({
        filterBy: null,
        filterValue: null,
        page: newPage + 1,
      });
      setRows(data1.getPagDashboards);
    }
  };

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
  let visibleRows = React.useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, rows, filterBy, filterValue]
  );

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar handleToolBar={handleToolBar} />

        {loading1 ? (
          <CircularProgress />
        ) : (
          <>
            <FormControlLabel
              control={<Switch checked={dense} onChange={handleChangeDense} />}
              label="Dense padding"
            />
            <TableContainer>
              <Table
                sx={{ minWidth: 600 }}
                aria-labelledby="tableTitle"
                size={dense ? "small" : "medium"}
              >
                <EnhancedTableHead
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleRequestSort}
                  rowCount={rows.length}
                />
                <TableBody>
                  {filterBy && filterValue
                    ? visibleRows.map((row, index) => {
                        const labelId = `enhanced-table-checkbox-${index}`;

                        return (
                          <TableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={row.ID}
                          >
                            <TableCell align="left">
                              {row.postalCodeFSA}
                            </TableCell>
                            <TableCell align="left">{row.City}</TableCell>
                            <TableCell align="right">
                              {row.completedJobs}
                            </TableCell>
                            <TableCell align="right">
                              ${row.completedRevenue}
                            </TableCell>
                            <TableCell align="right">
                              {" "}
                              $
                              {(
                                parseInt(row.completedRevenue) /
                                Number(row.completedJobs)
                              ).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    : rows.map((row, index) => {
                        const labelId = `enhanced-table-checkbox-${index}`;

                        return (
                          <TableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={row.ID}
                          >
                            <TableCell align="left">
                              {row.postalCodeFSA}
                            </TableCell>
                            <TableCell align="left">{row.City}</TableCell>
                            <TableCell align="right">
                              {row.completedJobs}
                            </TableCell>
                            <TableCell align="right">
                              ${row.completedRevenue}
                            </TableCell>
                            <TableCell align="right">
                              {" "}
                              $
                              {(
                                parseInt(row.completedRevenue) /
                                Number(row.completedJobs)
                              ).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        <TablePagination
          rowsPerPageOptions={[10]}
          component="div"
          count={filterBy && filterValue ? rows.length : 99999}
          rowsPerPage={10}
          page={page}
          onPageChange={handleChangePage}
        />
      </Paper>
    </Box>
  );
}
