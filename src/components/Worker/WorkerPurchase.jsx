import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import { BiPencil } from "react-icons/bi";
import { AiOutlineEye } from "react-icons/ai";

export default function WorkerPurchase() {
  const auth = useSelector((state) => state.pegawai);
  const [data_transaksi, setDataTransaksi] = useState([]);
  const [data, setData] = useState([]);
  const [data_supplier, setDataSupplier] = useState([]);
  const [supplier_id, setSupplierId] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/transaksi-pembelian/pegawai/${auth.id}`
        );
        setDataTransaksi(response.data.data);

        const supplierIds = [
          ...new Set(response.data.data.map((item) => item.supplier_id)),
        ];
        setSupplierId(supplierIds);

        const promises = supplierIds.map(async (supplierId) => {
          const response2 = await axios.get(
            `http://localhost:8000/supplier/${supplierId}`
          );
          return response2.data.data;
        });

        const fetchedDataSupplier = await Promise.all(promises);
        setDataSupplier(fetchedDataSupplier);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const columns = [
    {
      field: "id",
      headerName: "Transaction Id",
      width: 150,
    },
    {
      field: "createdAt",
      headerName: "Transaction Date",
      flex: 1,
    },
    {
      field: "supplierID",
      headerName: "Supplier ID",
      flex: 1,
    },
    {
      field: "supplierName",
      headerName: "Supplier Name",
      flex: 1,
    },
    {
      field: "totalAmount",
      headerName: "Total Amount",
      flex: 1,
    },
    {
      field: "detailTransaction",
      headerName: "Detail Transaction",
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        return (
          <Link to={`/barang-transaksi-pembelian/${params.id}`}>
            <Button
              variant="contained"
              size="small"
              startIcon={<BiPencil />}
              style={{ marginLeft: "10px" }}
            >
              Edit
            </Button>
          </Link>
        );
      },
    },
  ];

  const rows = data_transaksi.map((item) => {
    const supplier = data_supplier.find(
      (supplier) => supplier.id === item.supplier_id
    );
    return {
      id: item.id,
      createdAt:
        item.createdAt.split("T")[0] +
        " " +
        item.createdAt.split("T")[1].split("Z")[0],
      supplierID: item.supplier_id,
      supplierName: supplier ? supplier.nama : "",
      totalAmount: item.total_transaksi_pembelian,
    };
  });

  return (
    <>
      <div className="w-full mx-8 pt-1 mt-10 bg-white">
        <div className="flex justify-between items-center font-Poppins font-bold text-[18px]">
          <div>All Purchase History that You Serve.</div>
          <Button
            variant="contained"
            size="small"
            component={Link}
            to="/create-purchase-transaction"
          >
            Create Purchase Transaction
          </Button>
        </div>
        <br />
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          disableSelectionOnClick
          autoHeight
        />
      </div>
    </>
  );
}