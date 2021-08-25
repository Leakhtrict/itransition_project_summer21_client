import React, { useState, useEffect, forwardRef, useRef } from "react";
import axios from 'axios';
import { useTable, useRowSelect } from "react-table";
import { useHistory } from "react-router-dom";
import { COLUMNS } from "../helpers/columns";
import LockIcon from '@material-ui/icons/Lock';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import SecurityIcon from '@material-ui/icons/Security';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import DataGrid from "@material-ui/data-grid";

/*const SelectCheckbox = forwardRef(
    ({ indeterminate, ...rest }, ref) => {
      const defaultRef = useRef()
      const resolvedRef = ref || defaultRef
  
      useEffect(() => {
        resolvedRef.current.indeterminate = indeterminate
      }, [resolvedRef, indeterminate])
  
      return (
        <>
          <input type="checkbox" ref={resolvedRef} {...rest} />
        </>
      )
    }
  );*/

function AdminTable() {
    let history = useHistory();
    const [listOfUsers, setListOfUsers] = useState([]);

    useEffect(() => {
        axios.get("https://itransition-project-genis.herokuapp.com/users").then((response) => {
            setListOfUsers(response.data);
        });
    }, []);

    /*const tableInstance = useTable({
        columns: COLUMNS,
        data: listOfUsers
      },
        useRowSelect,
        (hooks) => {
          hooks.visibleColumns.push((columns) => {
            return [
              {
                id: "selection",
                Header: ({ getToggleAllRowsSelectedProps }) => (
                  <SelectCheckbox {...getToggleAllRowsSelectedProps()} />
                ),
                Cell: ({ row }) => (
                  <SelectCheckbox {...row.getToggleRowSelectedProps()} />
                )
              },
              ...columns,
            ];
          });
        }
      );
  
      const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        selectedFlatRows,
      } = tableInstance;*/

      const deleteData = () => {
        axios.get("https://itransition-project-genis.herokuapp.com/users/auth",
        { headers: { accessToken: localStorage.getItem("accessToken") } })
        .then((response) => {
          if (!response.data.error) {
            const deleteIds = selectedFlatRows.map(row => row.original.id);
            axios.put("https://itransition-project-genis.herokuapp.com/users/deleteUsers", deleteIds)
            .then(() => {
              history.go(0);
            });
          }
          else{
            history.push("/");
          }
        });
      };
  
      const blockUser = () => {
        axios.get("https://itransition-project-genis.herokuapp.com/users/auth",
        { headers: { accessToken: localStorage.getItem("accessToken") } })
        .then((response) => {
          if (!response.data.error) {
            const blockIds = selectedFlatRows.map(row => row.original.id);
            axios.put("https://itransition-project-genis.herokuapp.com/users/blockUsers", blockIds)
            .then(() => {
              history.go(0);
            });
          }
          else{
            history.push("/");
          }
        });
      };
  
      const unblockUser = () => {
        axios.get("https://itransition-project-genis.herokuapp.com/users/auth",
        { headers: { accessToken: localStorage.getItem("accessToken") } })
        .then((response) => {
          if (!response.data.error) {
            const unblockIds = selectedFlatRows.map(row => row.original.id);
            axios.put("https://itransition-project-genis.herokuapp.com/users/unblockUsers", unblockIds)
            .then(() => {
              history.go(0);
            });
          }
          else{
            history.push("/");
          }
        });
      };

      const adminUser = () => {
        axios.get("https://itransition-project-genis.herokuapp.com/users/auth",
        { headers: { accessToken: localStorage.getItem("accessToken") } })
        .then((response) => {
          if (!response.data.error) {
            const adminIds = selectedFlatRows.map(row => row.original.id);
            axios.put("https://itransition-project-genis.herokuapp.com/users/adminUsers", adminIds)
            .then(() => {
              history.go(0);
            });
          }
          else{
            history.push("/");
          }
        });
      };

      return(
        <>
          <div className="buttonBar">
            <LockIcon onClick={blockUser} title="Block" />
            <LockOpenIcon onClick={unblockUser} title="Unblock" />
            <SecurityIcon onClick={adminUser} title="Set admin" />
            <DeleteForeverIcon onClick={deleteData} title="Delete" />
          </div>
          <DataGrid
            rows={listOfUsers}
            columns={COLUMNS}
            checkboxSelection
            disableSelectionOnClick
          />
        </>
    );
};


export default AdminTable;