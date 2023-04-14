import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { useAuthContext } from "hooks/useAuthContext";
import { FormattedMessage } from "react-intl";
import { DataGrid, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton } from "@mui/x-data-grid"
import { Box, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";


const UnusedNumber = () => {

    const { user } = useAuthContext()
    const [serials, setSerials] = useState([])
    const serialStatus = true

    useEffect(() => {
        const fetchAllSerials = async () => {
            if (user) {
                try {
                    const response = await axios.get(`api/serials/status?serialStatus=${serialStatus}`, {
                        headers: { 'Authorization': `Bearer ${user.accessToken}` }
                    });
                    setSerials(response.data);
                } catch (error) {
                    console.log(error);
                }
            }
        };
        fetchAllSerials();
    }, [user]);

    const theme = useTheme()
    const colors = tokens(theme.palette.mode)

    function formatNumber(num) {
        const formatted = num.toLocaleString('en-US', { maximumFractionDigits: 0 }).replace(/,/g, '');
        const sections = [];

        for (let i = 0; i < formatted.length; i += 4) {
            sections.push(formatted.substr(i, 4));
        }

        return sections.join('-');
    }

    const columns = [
        {
            field: "serialNo",
            headerName: <FormattedMessage id="record.serial.number" />,
            type: "number",
            headerAlign: "center",
            align: "center",
            valueGetter: (params) =>
                formatNumber(params.row.serialNo),
            width: 370
        },
        {
            field: "givenCredit",
            headerName: <FormattedMessage id="record.credit" />,
            type: "number",
            headerAlign: "center",
            align: "center",
            width: 370
        },
        {
            field: "remarkName",
            headerName: <FormattedMessage id="record.buyer" />,
            width: 370,
            cellClassName: "name-column--cell",
            headerAlign: "center",
            align: "center"
        },
        {
            field: "createdAt",
            headerName: <FormattedMessage id="record.sold.date" />,
            valueFormatter: (params) =>
                moment(params.value).format("YYYY-MM-DD h:mm:ss a"),
            width: 370,
            headerAlign: "center",
            align: "center"
        },
    ]

    const getRowId = (row) => row._id

    const CustomToolbar = () => {
        return (
            <GridToolbarContainer>
                <GridToolbarColumnsButton />
                <GridToolbarFilterButton />
                <GridToolbarExport />
            </GridToolbarContainer>
        )
    }

    return (
        <Box m="20px">
            <Header
                title={<FormattedMessage id="valid.serials" />}
                subtitle={<FormattedMessage id="valid.serials" />}
            />
            <Box height="70vh" width='100%' sx={{
                "& .name-column--cell": {
                    color: colors.greenAccent[300]
                },
                "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: colors.blueAccent[700],
                },
                "& .MuiDataGrid-footerContainer": {
                    backgroundColor: colors.blueAccent[700]
                },
                "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                    color: `${colors.grey[100]} !important`
                },
            }}>
                <DataGrid
                    rows={serials}
                    columns={columns}
                    components={{ Toolbar: CustomToolbar }}
                    getRowId={getRowId}
                    disableColumnMenu
                />

                <Box className="footer"></Box>
            </Box>
        </Box>

    )
}

export default UnusedNumber