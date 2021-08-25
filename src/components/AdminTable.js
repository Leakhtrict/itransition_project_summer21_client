import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useHistory } from "react-router-dom";
import { COLUMNS } from "../helpers/columns";
import LockIcon from '@material-ui/icons/Lock';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import SecurityIcon from '@material-ui/icons/Security';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { DataGrid } from "@material-ui/data-grid";

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
    const [listOfIds, setListOfIds] = useState([]);

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
            const deleteIds = listOfIds;
            axios.put("https://itransition-project-genis.herokuapp.com/users/deleteUsers", deleteIds)
            /*.then(() => {
              history.go(0);
            });*/
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
            const blockIds = listOfIds;
            axios.put("https://itransition-project-genis.herokuapp.com/users/blockUsers", blockIds)
            blockIds.map((value) => {
              setListOfUsers(listOfUsers.map((user) => {
                if(value == user.id){
                  return [...user, { isBlocked: true }]
                } else {
                  return user;
                }
              }))
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
            const unblockIds = listOfIds;
            axios.put("https://itransition-project-genis.herokuapp.com/users/unblockUsers", unblockIds)
            /*.then(() => {
              history.go(0);
            });*/
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
            const adminIds = listOfIds;
            axios.put("https://itransition-project-genis.herokuapp.com/users/adminUsers", adminIds)
            /*.then(() => {
              history.go(0);
            });*/
          }
          else{
            history.push("/");
          }
        });
      };

      return(
        <>
          <div className="buttonBar">
            <LockIcon className="buttons" onClick={blockUser} title="Block" />
            <LockOpenIcon className="buttons" onClick={unblockUser} title="Unblock" />
            <SecurityIcon className="buttons" onClick={adminUser} title="Set admin" />
            <DeleteForeverIcon className="buttons" onClick={deleteData} title="Delete" />
          </div>
          <div style={{ height: 500, width: 872 }} >
            <DataGrid
              rows={listOfUsers}
              columns={COLUMNS}
              checkboxSelection
              disableSelectionOnClick
              disableColumnMenu
              onSelectionModelChange={itm => setListOfIds(itm)}
            />
          </div>
        </>
    );
};

export default AdminTable;