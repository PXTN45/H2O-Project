import { usePackageData } from "../../../AuthContext/packageData";

const Policies = () => {
  const {statusAccept, setStatusAccept } = usePackageData();

  const acceptStatus = () => {

    setStatusAccept(!statusAccept)
  };

  return (
    <div className="mt-10  w-full flex justify-center">
      <div className="w-full">
        <div>
          <span className="text-lg">นโยบาย</span>
        </div>
        <div className="shadow-boxShadow rounded-lg my-3">
          <div className="p-3 bg-primaryBusiness rounded-t-lg"></div>
          <div className="px-5 py-10">
            <div className="mb-5">
              <span className="text-lg">
                คุณมีหน้าที่รับผิดชอบในการตรวจสอบกฎหมายและภาษีในท้องถิ่น
              </span>
            </div>
            <p>
              โปรดระวังข้อบังคับ กฎหมาย
              และภาระภาษีในท้องถิ่นของท่านก่อนทําการจอง
              หลายประเทศและหลายเมืองมีกฎหมายเฉพาะเกี่ยวกับการใช้ทรัพย์สินของคุณเป็นการเช่าระยะสั้นสําหรับการแชร์บ้านและ
              / หรือสําหรับการโฮสต์มืออาชีพ
              ท่านมีหน้าที่รับผิดชอบในการทํางานภายใต้กรอบกฎหมายของประเทศของท่าน
              ซึ่งอาจรวมถึงการได้รับใบอนุญาต ใบอนุญาต
              หรือการลงทะเบียนที่เกี่ยวข้องก่อนทําการจอง
              และชําระภาษีที่เกี่ยวข้องสําหรับรายได้ใดๆ
              ที่ท่านได้รับจากการจองดังกล่าว
            </p>
          </div>
        </div>
        <div>
          <div className="w-full flex justify-end">
            <input
              type="checkbox"
              name="Policy"
              className="checkbox checkbox-primary"
              onClick={acceptStatus}
              checked={statusAccept === true}
            />
            <span className="ml-2">ยอมรับนโยบายทั้งหมด</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Policies;
