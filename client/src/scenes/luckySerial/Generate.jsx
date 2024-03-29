import axios from "axios"
import * as yup from "yup"
import { useState } from "react"
import { useAuthContext } from "../../hooks/useAuthContext"
import { FormattedMessage } from "react-intl"
import { Formik } from "formik"
import { CSVLink } from 'react-csv'
import { CopyToClipboard } from "react-copy-to-clipboard"
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material"
import Header from "../../components/Header"
import CreditButton from "../../components/CreditButton"
import CreditTextField from "../../components/TextField"
import '../../css/generateNumber.css'
import '../../index.css'


const GenerateNumber = () => {

    const { user } = useAuthContext()

    const [serialsData, setSerialsData] = useState([])

    const handleFormSubmit = async (values) => {
        try {
            const response = await axios.post('api/serials/generate', values, {
                headers: { 'Authorization': `Bearer ${user.accessToken}` },
            })

            const datagriddata = response.data.serialDocs

            const da = datagriddata.map(dgd => ({
                _id: dgd._id,
                serialNo: dgd.serialNo,
                givenCredit: dgd.givenCredit,
                remarkName: dgd.remarkName,
                createdAt: dgd.createdAt
            }))

            setSerialsData(da)

        } catch (error) {
            console.log(error)
        }
    }

    const headers = [
        { label: 'Serial Number', key: 'serialNo' },
        { label: 'Given Credit', key: 'givenCredit' },
        { label: 'Buyer', key: 'remarkName' },
        { label: 'Buy Date', key: 'createdAt' },
    ];

    const data = serialsData.map(serialData => {
        const serialNo = serialData.serialNo
        const formattedSerialNo = `${serialNo.substring(0, 4)}-${serialNo.substring(4, 8)}-${serialNo.substring(8, 12)}-${serialNo.substring(12)}`;
        return {
            serialNo: formattedSerialNo,
            givenCredit: serialData.givenCredit,
            remarkName: serialData.remarkName,
            createdAt: new Date(serialData.createdAt).toLocaleString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                hour12: true,
            }),
        };
    });

    const CSVcreatedAt = new Date(data[0]?.createdAt);
    const CSVformattedDate = `${CSVcreatedAt.getDate().toString().padStart(2, '0')}${(CSVcreatedAt.getMonth() + 1).toString().padStart(2, '0')}${CSVcreatedAt.getFullYear().toString().slice(2)}_${CSVcreatedAt.getHours().toString().padStart(2, '0')}${CSVcreatedAt.getMinutes().toString().padStart(2, '0')}${CSVcreatedAt.getSeconds().toString().padStart(2, '0')}`;

    return <Box m="20px">
        <Header
            title={<FormattedMessage id="generate.serial" />}
            subtitle={<FormattedMessage id="top.up.credit" />}
        />

        <Formik
            onSubmit={handleFormSubmit}
            initialValues={initialValues}
            validationSchema={checkoutSchema}
        >
            {({ values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue }) => (
                <form onSubmit={handleSubmit}>
                    <Box className="credit-button-component" >
                        <CreditButton onClick={() => setFieldValue("givenCredit", 5)} title="RM5" />
                        <CreditButton onClick={() => setFieldValue("givenCredit", 10)} title="RM10" />
                        <CreditButton onClick={() => setFieldValue("givenCredit", 15)} title="RM15" />
                        <CreditButton onClick={() => setFieldValue("givenCredit", 20)} title="RM20" />
                        <CreditButton onClick={() => setFieldValue("givenCredit", 30)} title="RM30" />
                        <CreditButton onClick={() => setFieldValue("givenCredit", 50)} title="RM50" />
                        <CreditButton onClick={() => setFieldValue("givenCredit", 100)} title="RM100" />
                        <CreditButton onClick={() => setFieldValue("givenCredit", 200)} title="RM200" />
                        <CreditButton onClick={() => setFieldValue("givenCredit", 300)} title="RM300" />
                        <CreditButton onClick={() => setFieldValue("givenCredit", 500)} title="RM500" />
                        <CreditButton onClick={() => setFieldValue("givenCredit", 800)} title="RM800" />
                        <CreditButton onClick={() => setFieldValue("givenCredit", 1000)} title="RM1000" />
                    </Box>

                    <Box className="credit-field-component" >

                        {/* Reload Amount */}
                        <CreditTextField
                            fullWidth
                            variant="filled"
                            type="number"
                            label={<FormattedMessage id="generate.amount" />}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.givenCredit}
                            name="givenCredit"
                            error={!!touched.givenCredit && !!errors.givenCredit}
                            helperText={touched.givenCredit && errors.givenCredit}
                            InputProps={{ readOnly: true, }}
                            sx={{ gridColumn: "span 2" }}
                        />

                        {/* Reload Quantity */}
                        <CreditTextField
                            fullWidth
                            variant="filled"
                            type="number"
                            label={<FormattedMessage id="generate.quantity" />}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.amountToGenerate}
                            name="amountToGenerate"
                            error={!!touched.amountToGenerate && !!errors.amountToGenerate}
                            helperText={touched.amountToGenerate && errors.amountToGenerate}
                            InputProps={{ readOnly: false }}
                            sx={{ gridColumn: "span 2" }}
                        />

                        {/* Remark */}
                        <CreditTextField
                            fullWidth
                            variant="filled"
                            type="text"
                            label={<FormattedMessage id="generate.buyer" />}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.remarkName}
                            name="remarkName"
                            error={!!touched.remarkName && !!errors.remarkName}
                            helperText={touched.remarkName && errors.remarkName}
                            InputProps={{ readOnly: false }}
                            sx={{ gridColumn: "span 2" }}
                        />
                    </Box>

                    <Box className="generate-button-component" >
                        <Button
                            className="generate-button-text"
                            type="submit"
                            variant="contained"
                        >
                            <FormattedMessage id="generate.button" />
                        </Button>
                    </Box>

                    {serialsData.length > 0 && (
                        <>
                            <Box className="copy-button-component">
                                <CopyToClipboard text={serialsData.map(d => d.serialNo.replace(/(.{4})(?!$)/g, '$1-')).join('\n')}>
                                    <Button
                                        className="copy-button-text"
                                        variant="contained"
                                    >
                                        <FormattedMessage id="copy" />
                                    </Button>
                                </CopyToClipboard>
                            </Box>

                            <TableContainer component={Paper} sx={{ mt: 2, textAlign: "center", color: '#2E7C67' }}>
                                <Table>
                                    <TableHead sx={{ backgroundColor: '#a4a9fc' }}>
                                        <TableRow>
                                            <TableCell align="center" ><FormattedMessage id="serial.number" /></TableCell>
                                            <TableCell align="center"><FormattedMessage id="serial.credit" /></TableCell>
                                            <TableCell align="center"><FormattedMessage id="serial.buyer" /></TableCell>
                                            <TableCell align="center"><FormattedMessage id="serial.purchase.date" /></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {serialsData.map((serialData) => (
                                            <TableRow key={serialData._id}>
                                                <TableCell align="center" sx={{ color: '#2E7C67' }}>{`${serialData.serialNo.substring(0, 4)}-${serialData.serialNo.substring(4, 8)}-${serialData.serialNo.substring(8, 12)}-${serialData.serialNo.substring(12)}`}</TableCell>
                                                <TableCell align="center" sx={{ color: '#2E7C67' }}>{serialData.givenCredit}</TableCell>
                                                <TableCell align="center" sx={{ color: '#2E7C67' }}>{serialData.remarkName}</TableCell>
                                                <TableCell align="center" sx={{ color: '#2E7C67' }}>
                                                    {new Date(serialData.createdAt).toLocaleString('en-US', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric',
                                                        hour: 'numeric',
                                                        minute: 'numeric',
                                                        second: 'numeric',
                                                        hour12: true,
                                                    })}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>


                            <Box className="export-button-component">
                                <CSVLink data={data} headers={headers} filename={`${data[0]?.remarkName}_${CSVformattedDate}.csv`}>
                                    <Button
                                        className="export-button-text"
                                        variant="contained">
                                        <FormattedMessage id="export.csv" />
                                    </Button>
                                </CSVLink>
                            </Box>

                            <Box className="footer"></Box>
                        </>
                    )}
                </form>
            )}
        </Formik>
    </Box >
}

const checkoutSchema = yup.object().shape({
    givenCredit: yup.number().required(<FormattedMessage id="credit.error" />),
    amountToGenerate: yup.number().required(<FormattedMessage id="amount.error" />),
    remarkName: yup.string().required(<FormattedMessage id="remark.error" />),
})

const initialValues = {
    givenCredit: "",
    amountToGenerate: "",
    remarkName: "",
}

export default GenerateNumber