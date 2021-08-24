export const COLUMNS = [
    {
        Header: "Id",
        accessor: "id"
    },
    {
        Header: "Username",
        accessor: "username"
    },
    {
        Header: "E-mail",
        accessor: "email"
    },
    {
        Header: "Blocked",
        accessor: "isBlocked",
        Cell: (props) => {
            return <div>{props.value.toString()}</div>
        }
    },
    {
        Header: "Admin",
        accessor: "isAdmin",
        Cell: (props) => {
            return <div>{props.value.toString()}</div>
        }
    },
    {
        Header: "Reg. date",
        accessor: "createdAt",
        Cell: (props) => {
            return <div>{new Date(props.value).toLocaleString()}</div>
        }
    }
]