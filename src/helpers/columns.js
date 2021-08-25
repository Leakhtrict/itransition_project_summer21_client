export const COLUMNS = [
    {
        field: 'id',
        headerName: 'ID',
        width: 40
    },
    {
        field: 'username',
        headerName: 'Username',
        width: 140
    },
    {
        field: 'email',
        headerName: 'E-Mail',
        width: 220
    },
    {
        field: 'isBlocked',
        headerName: 'Blocked',
        width: 50,
        valueFormatter: (props) => {
            return `${props.value.toString()}`
        }
    },
    {
        field: 'isAdmin',
        headerName: 'Admin',
        width: 50,
        valueFormatter: (props) => {
            return `${props.value.toString()}`
        }
    },
    {
        field: 'createdAt',
        headerName: 'Reg. date',
        width: 220,
        valueFormatter: (props) => {
            return `${new Date(props.value).toLocaleString()}`
        }
    }
]