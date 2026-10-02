import {
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  InboxOutlined,
} from "@ant-design/icons";
import { App, Modal, Table, Upload } from "antd";
import type { TableProps, UploadFile } from "antd";
import { UploadChangeParam } from "antd/es/upload";
import { useState } from "react";
import ExcelJS from "exceljs";
import { importUsers } from "@/services/user.api";
import sampleFile from "assets/excel/sample.xlsx?url";

const { Dragger } = Upload;

interface IProps {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  current: number;
  pageSize: number;
  searchObject: IUserSearchField;
  setSort: (value: ISort) => void;
  fetchUser: (
    current: number,
    pageSize: number,
    fullName?: string,
    email?: string,
    createdAt?: string[],
    sort?: ISort,
  ) => void;
}

const ImportModal = (props: IProps) => {
  const { message, notification } = App.useApp();
  const {
    isModalOpen,
    setIsModalOpen,
    current,
    pageSize,
    searchObject,
    setSort,
    fetchUser,
  } = props;

  const [data, setData] = useState<IUserImport[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const columns: TableProps<IUserImport>["columns"] = [
    {
      title: "Tên hiển thị",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
  ];

  const changeDragger = (info: UploadChangeParam<UploadFile<unknown>>) => {
    const validMimeType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

    //check valid .xlsx
    if (info.file.type !== validMimeType) {
      message.error("File tải lên không hợp lệ!");
      setFileList([]);
      setData([]);
      return;
    }

    setFileList(info.fileList);

    const file = (info.file.originFileObj || info.file) as Blob;
    const reader = new FileReader();

    try {
      reader.onload = async (e) => {
        const buffer = e.target!.result as ExcelJS.Buffer;
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(buffer);

        // Lấy sheet đầu tiên
        const worksheet = workbook.getWorksheet(1);
        const row = worksheet?.getRow(1);

        if (
          !(
            (row?.values as string[])[1] === "fullName" &&
            (row?.values as string[])[2] === "email" &&
            (row?.values as string[])[3] === "phone"
          )
        ) {
          message.error("Format trong file .xlsx chưa chuẩn");
          setFileList([]);
          setData([]);
          return;
        }

        const data: IUserImport[] = [];

        worksheet!.eachRow((row, rowNumber) => {
          if (rowNumber === 1) return;

          const newUser: IUserImport = {
            fullName: (row.values as string[])[1],
            email: (row.values as string[])[2],
            password: "Abc123@",
            phone: (row.values as string[])[3],
          };

          data.push(newUser);
        });

        setData(data);
      };

      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.log(error);
    }
  };

  const handleImport = async () => {
    //call API
    const res = await importUsers(data);

    if (res.data) {
      //display message
      notification.open({
        message: <h3>Import Users</h3>,
        description: (
          <>
            <div>
              <CheckCircleTwoTone twoToneColor="#23e03c" />
              <span> Success: {res.data.countSuccess}</span>
            </div>
            <div>
              <CloseCircleTwoTone twoToneColor="#e42a2a" />
              <span> Failed: {res.data.countError}</span>
            </div>
          </>
        ),
      });

      //close modal
      setIsModalOpen(false);

      //reload table
      await fetchUser(
        current,
        pageSize,
        searchObject.fullName,
        searchObject.email,
        searchObject.createdAt,
        { name: "createdAt", type: "descend" },
      );

      setSort({ name: "createdAt", type: "descend" });

      //clear data MODAL
      setData([]);
      setFileList([]);
    }
  };

  return (
    <>
      <Modal
        title="Import data User"
        okText="Import"
        okButtonProps={{
          disabled: data.length === 0 ? true : false,
        }}
        open={isModalOpen}
        onOk={handleImport}
        onCancel={() => setIsModalOpen(false)}
        width="55vw"
      >
        <Dragger
          multiple={false}
          maxCount={1} //max 1 file
          fileList={fileList}
          onChange={changeDragger}
          //no automatically send request (Dragger)
          beforeUpload={() => false}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
          <p className="ant-upload-hint">
            Support for a single upload. Only accept .xlsx
          </p>
          <p>
            Download sample Import File{" "}
            <a
              onClick={(e) => e.stopPropagation()}
              href={sampleFile}
              download="sampleImport.xlsx"
            >
              here
            </a>
          </p>
        </Dragger>

        <div style={{ margin: "20px 0px" }}>Dữ liệu upload:</div>

        <Table<IUserImport> columns={columns} dataSource={data} />
      </Modal>
    </>
  );
};

export default ImportModal;
