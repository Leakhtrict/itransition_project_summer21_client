export const COLUMNS = [
    {
        field: 'id',
        headerName: 'ID',
        sortable: false,
        width: 60
    },
    {
        field: 'username',
        headerName: 'Username',
        sortable: false,
        width: 140
    },
    {
        field: 'email',
        headerName: 'E-Mail',
        sortable: false,
        width: 220
    },
    {
        field: 'isBlocked',
        headerName: 'Blocked',
        sortable: false,
        width: 80,
        valueFormatter: (props) => {
            return `${props.value.toString()}`
        }
    },
    {
        field: 'isAdmin',
        headerName: 'Admin',
        sortable: false,
        width: 80,
        valueFormatter: (props) => {
            return `${props.value.toString()}`
        }
    },
    {
        field: 'createdAt',
        headerName: 'Reg. date',
        sortable: false,
        width: 220,
        valueFormatter: (props) => {
            return `${new Date(props.value).toLocaleString()}`
        }
    }
]