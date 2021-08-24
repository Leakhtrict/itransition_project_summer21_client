import React, { useState, useEffect, forwardRef, useRef } from "react";
import axios from 'axios';
import { useTable, useRowSelect } from "react-table";
import { useHistory } from "react-router-dom";
import { COLUMNS } from "../helpers/columns";

const SelectCheckbox = forwardRef(
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
  );

function AdminTable() {
    let history = useHistory();
    const [listOfUsers, setListOfUsers] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:3001/users").then((response) => {
            setListOfUsers(response.data);
        });
    }, []);

    const tableInstance = useTable({
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
      } = tableInstance;

      const deleteData = () => {
        axios.get("http://localhost:3001/users/auth", {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }).then((response) => {
          if (!response.data.error) {
            const deleteIds = selectedFlatRows.map(row => row.original.id);
            axios.put("http://localhost:3001/users/deleteUsers", deleteIds)
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
        axios.get("http://localhost:3001/users/auth", {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }).then((response) => {
          if (!response.data.error) {
            const blockIds = selectedFlatRows.map(row => row.original.id);
            axios.put("http://localhost:3001/users/blockUsers", blockIds)
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
        axios.get("http://localhost:3001/users/auth", {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }).then((response) => {
          if (!response.data.error) {
            const unblockIds = selectedFlatRows.map(row => row.original.id);
            axios.put("http://localhost:3001/users/unblockUsers", unblockIds)
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
        axios.get("http://localhost:3001/users/auth", {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }).then((response) => {
          if (!response.data.error) {
            const adminIds = selectedFlatRows.map(row => row.original.id);
            axios.put("http://localhost:3001/users/adminUsers", adminIds)
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
            <button className="buttons" onClick={blockUser} title="Block">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="black" class="bi bi-lock-fill" viewBox="0 0 16 16">
                  <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
              </svg>
            </button>
            <button className="buttons" onClick={unblockUser} title="Unblock">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="black" class="bi bi-unlock-fill" viewBox="0 0 16 16">
                <path d="M11 1a2 2 0 0 0-2 2v4a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h5V3a3 3 0 0 1 6 0v4a.5.5 0 0 1-1 0V3a2 2 0 0 0-2-2z"/>
              </svg>
            </button>
            <button className="buttons" onClick={adminUser} title="Set admin">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="black" class="bi bi-shield-fill-check" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M8 0c-.69 0-1.843.265-2.928.56-1.11.3-2.229.655-2.887.87a1.54 1.54 0 0 0-1.044 1.262c-.596 4.477.787 7.795 2.465 9.99a11.777 11.777 0 0 0 2.517 2.453c.386.273.744.482 1.048.625.28.132.581.24.829.24s.548-.108.829-.24a7.159 7.159 0 0 0 1.048-.625 11.775 11.775 0 0 0 2.517-2.453c1.678-2.195 3.061-5.513 2.465-9.99a1.541 1.541 0 0 0-1.044-1.263 62.467 62.467 0 0 0-2.887-.87C9.843.266 8.69 0 8 0zm2.146 5.146a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.793l2.646-2.647z"/>
              </svg>
            </button>
            <button className="buttons" onClick={deleteData} title="Delete">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="black" class="bi bi-person-x-fill" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm6.146-2.854a.5.5 0 0 1 .708 0L14 6.293l1.146-1.147a.5.5 0 0 1 .708.708L14.707 7l1.147 1.146a.5.5 0 0 1-.708.708L14 7.707l-1.146 1.147a.5.5 0 0 1-.708-.708L13.293 7l-1.147-1.146a.5.5 0 0 1 0-.708z"/>
              </svg>
            </button>
          </div>
          <table className="mainTable" {...getTableProps()}>
            <thead>
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()} >
              {rows.map((row, i) => {
                prepareRow(row)
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map(cell => {
                        return(
                            (cell.column.id === "username" && 
                                <td {...cell.getCellProps()} onClick={() => history.push(`/user/${cell.row.original.id}`)} >{cell.render('Cell')}</td>
                            ) ||
                            (cell.column.id !== "username" &&
                                <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                            )
                        )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </>
    );
};


export default AdminTable;