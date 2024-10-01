import { RowDataPacket, ResultSetHeader } from "mysql2"; // Import type for rows returned from queries
import { promisePool } from "../config/db";

// ฟังก์ชันเพื่อค้นหาข้อมูลนักเรียนตาม student ID
const selectProductById = async (studentid: number) => {
  try {
    const [rows]: [RowDataPacket[], any] = await promisePool.query(
      "SELECT * FROM product WHERE id = ?",
      [studentid]
    );
    return rows.length ? rows[0] : null;
  } catch (err) {
    console.error("Database query error:", err);
    throw err;
  }
};

// ฟังก์ชันเพื่อดึงข้อมูลทั้งหมดจากตาราง product
const selectAll = async () => {
  try {
    const [rows]: [RowDataPacket[], any] = await promisePool.query(
      "SELECT * FROM product"
    );
    return rows;
  } catch (err) {
    console.error("Database query error:", err);
    throw err;
  }
};

// ฟังก์ชันเพื่อลบข้อมูลนักเรียนตาม student ID
const deleteProductById = async (studentid: number): Promise<void> => {
  try {
    console.log(`Attempting to delete product with student ID: ${studentid}`);
    const [result] = await promisePool.query<ResultSetHeader>(
      "DELETE FROM product WHERE id = ?",
      [studentid]
    );
    console.log("Delete result:", result);
    if (result.affectedRows === 0) {
      console.warn(`No product found with student ID: ${studentid}`);
    } else {
      console.log(`Product with student ID ${studentid} deleted successfully.`);
    }
  } catch (err) {
    console.error("Database deletion error:", err);
    throw err;
  }
};

// ฟังก์ชันเพื่อตรวจสอบและเพิ่มข้อมูลนักเรียนใหม่
const insertProductWithCheck = async (
  studentid: number,
  name: string,
  lastname: string
): Promise<void> => {
  // ตรวจสอบว่ามี product อยู่หรือไม่
  const existingProduct = await selectProductById(studentid);
  if (existingProduct) {
    console.warn(`Product with student ID ${studentid} already exists`);
    return;
  }

  // ถ้าไม่มีข้อมูลซ้ำ ให้ทำการ insert
  await insertProduct(studentid, name, lastname);
};

// ฟังก์ชันเพื่อเพิ่มข้อมูลนักเรียนใหม่
const insertProduct = async (
  studentid: number,
  name: string,
  lastname: string
): Promise<void> => {
  if (!studentid || typeof studentid !== 'number') {
    throw new Error("Invalid student ID");
  }

  if (!name || typeof name !== 'string' || !lastname || typeof lastname !== 'string') {
    throw new Error("Name and Lastname must be non-empty strings");
  }

  try {
    const [result] = await promisePool.query<ResultSetHeader>(
      "INSERT INTO product (id, name, lastname) VALUES (?, ?, ?)",
      [studentid, name, lastname]
    );
    console.log("Insert result:", result);
    if (result.affectedRows === 0) {
      console.warn("Insert operation did not affect any rows");
    } else {
      console.log(`Product with student ID ${studentid} added successfully.`);
    }
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      console.error(`Duplicate entry for student ID: ${studentid}`);
    } else {
      console.error("Database insertion error:", err);
    }
    throw err;
  }
};

// ฟังก์ชันเพื่ออัปเดตข้อมูลนักเรียนตาม student ID
const updateProduct = async (
  studentid: number,
  name: string,
  lastname: string
): Promise<void> => {
  if (!studentid || typeof studentid !== 'number') {
    throw new Error("Invalid student ID");
  }

  if (!name || typeof name !== 'string' || !lastname || typeof lastname !== 'string') {
    throw new Error("Name and Lastname must be non-empty strings");
  }

  try {
    const [result] = await promisePool.query<ResultSetHeader>(
      "UPDATE product SET name = ?, lastname = ? WHERE id = ?",
      [name, lastname, studentid]
    );
    console.log("Update result:", result);
    if (result.affectedRows === 0) {
      console.warn(`No product found with student ID: ${studentid}`);
    } else {
      console.log(`Product with student ID ${studentid} updated successfully.`);
    }
  } catch (err) {
    console.error("Database update error:", err);
    throw err;
  }
};

// เรียกใช้ฟังก์ชันหลัก
const main = async () => {
  const studentid = 345;
  const name = "บัณฑิตา";
  const lastname = "สุริยะ";

  // เรียกใช้ฟังก์ชัน insertProductWithCheck เพื่อตรวจสอบว่ามีข้อมูลอยู่แล้วหรือไม่ก่อนที่จะเพิ่ม
  await insertProductWithCheck(studentid, name, lastname);

  // หรือใช้ฟังก์ชัน updateProduct เพื่ออัปเดตข้อมูลหากมีการเปลี่ยนแปลง
  // await updateProduct(studentid, name, lastname);
};

// Export ฟังก์ชันทั้งหมด
export default { selectAll, selectProductById, deleteProductById, insertProductWithCheck, insertProduct, updateProduct };

// เรียกใช้ฟังก์ชันหลัก
main().catch(console.error);