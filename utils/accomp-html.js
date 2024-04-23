import moment from "moment";
import Order from "../models/Order.js";
import Accompaniment from "../models/Accompaniment.js";
const AccompHtml = async ({ order, accompaniment }) => {
  const orders = await Order.findById(order).populate([
    "size",
    "client",
    {
      path: "style",
      populate: ["gage", "modelType", "ply", "material", "size"],
    },
  ]);

  const accompaniments = await Accompaniment.findById(accompaniment).populate([
    "knitter",
    {
      path: "order",
      populate: ["style"],
    },
  ]);

  const color = orders.style.colorCode;
  const part = orders.style.partNomer;
  const colorArray = color.split("/");
  const partArray = part.split("/");
  return `<div class="page">
  <table  cellspacing="0">
    <tr>
      <td
        class="border border-dark text-center"
        rowspan="2"
        colspan="2"
      >
        <img
          src="https://boostersback.com/upload/def-logo.png"
          alt="Header Avatar"
          height="50"
          width="50"
        />
      </td>
      <td class="border border-dark text-center" colspan="4">
        ${moment(orders.createdAt).format("YYYY-MM-DD HH:mm")}
      </td>
      <td class="border border-dark  " colspan="2">
        Ачилт огноо
      </td>
      <td class="border border-dark text-center" colspan="2">
      ${moment(orders.deadline).format("YYYY-MM-DD HH:mm")}
      </td>
      <td class="border border-dark text-center" colspan="7">
        Тайлбар: / ${
          orders.orderType === "repetition"
            ? orders.retryDescription
            : "Дахин хийлт биш"
        } / 
      </td>
    </tr>
    <tr>
      <td class="border border-dark text-center" colspan="4">
        <strong>${accompaniments.barcode}</strong>
      </td>
      <td class="border border-dark " colspan="2">
        Захиалга
      </td>
      <td colspan="7" class="border border-dark text-center">
        <strong>${orders.client?.name}</strong>
      </td>
      <td colspan="2" class="border border-dark text-center">
        ${
          orders.orderType === "repair"
            ? "Засвар"
            : orders.orderType === "mass"
            ? "Масс"
            : orders.orderType === "repetition"
            ? "Дахин хийлт"
            : "Хөөлт"
        }
      </td>
    </tr>
    <tr>
      <td
        class="border border-dark text-center"
        colspan="6"
        rowspan="2"
        height="50px"
      >
      <img
      src="https://boostersback.com/upload/barcode.png"
      alt="Header Avatar"
      height="50px"
      width="100px"
    />
      </td>
      <td class="border border-dark text-center" colspan="2">
        Загвар
      </td>
      <td colspan="4" class="border border-dark text-center">
        ${orders.style.modelType.name}
      </td>
      <td colspan="3" class="border border-dark text-center">
        ${orders.style.modelNomer}
      </td>
      <td colspan="1" class="border border-dark text-center">
        Хэмжээ
      </td>
      <td colspan="1" class="border border-dark text-center" style="width: 40px;" >
        ${orders.size.name}
      </td>
    </tr>
    <tr>
      <td class="border border-dark text-center" colspan="2">
        Утас №
      </td>
      <td colspan="2" class="border border-dark text-center">
        ${orders.style.ply.name}
      </td>
      <td colspan="2" class="border border-dark text-center">
        Түүхий эд
      </td>
      <td colspan="3" class="border border-dark text-center">
      ${orders.style.material.name}
      </td>
      <td colspan="1" class="border border-dark text-center">
        Гейч
      </td>
      <td colspan="1" class="border border-dark text-center">
      ${orders.style.gage.name}
      </td>
    </tr>
    <tr>
      <td class="border border-dark" colspan="3">
        Өнгө
      </td>
      <td class="border border-dark text-center" style="width: 40px;" colspan="1">
        ${colorArray[0] || " "}
      </td>
      <td class="border border-dark text-center" style="width: 40px;" colspan="1">
      ${colorArray[1] || " "}
      </td>
      <td class="border border-dark text-center" style="width: 40px;" colspan="1">
      ${colorArray[2] || " "}
      </td>
      <td class="border border-dark text-center" style="width: 40px;" colspan="1">
      ${colorArray[3] || " "}
      </td>
      <td class="border border-dark text-center" style="width: 40px;" colspan="1">
      ${colorArray[4] || " "}
      </td>
      <td class="border border-dark text-center" style="width: 40px;" colspan="1">
      ${colorArray[5] || " "}
      </td>
      <td class="border border-dark text-center" style="width: 40px;" colspan="1">
      ${colorArray[6] || " "}
      </td>
      <td class="border border-dark text-center" style="width: 40px;" colspan="1">
      ${colorArray[7] || " "}
      </td>
      <td class="border border-dark text-center" style="width: 40px;" colspan="1">
      ${colorArray[8] || " "}
      </td>
      <td class="border border-dark text-center" style="width: 40px;" colspan="1">
      ${colorArray[9] || " "}
      </td>
      <td class="border border-dark text-center" style="width: 40px;" colspan="1">
      ${colorArray[10] || " "}
      </td>
      <td class="border border-dark text-center" style="width: 40px;" colspan="1">
      ${colorArray[11] || " "}
      </td>
      <td
        class="border border-dark text-center"
        colspan="1"
        rowspan="2"
      >
        Тоо
      </td>
      <td
        class="border border-dark text-center"
        colspan="1"
        rowspan="2"
      >
        ${accompaniments.quantity}
      </td>
    </tr>
    <tr>
      <td class="border border-dark" colspan="3">
        Парт
      </td>
      <td class="border border-dark text-center " colspan="1">
        ${partArray[0] || " "}
      </td>
      <td class="border border-dark text-center " colspan="1">
      ${partArray[1] || " "}
      </td>
      <td class="border border-dark text-center" colspan="1">
      ${partArray[2] || " "}
      </td>
      <td class="border border-dark text-center" colspan="1">
      ${partArray[3] || " "}
      </td>
      <td class="border border-dark text-center" colspan="1">
      ${partArray[4] || " "}
      </td>
      <td class="border border-dark text-center" colspan="1">
      ${partArray[5] || " "}
      </td>
      <td class="border border-dark text-center" colspan="1">
      ${partArray[6] || " "}
      </td>
      <td class="border border-dark text-center" colspan="1">
      ${partArray[7] || " "}
      </td>
      <td class="border border-dark text-center" colspan="1">
      ${partArray[8] || " "}
      </td>
      <td class="border border-dark text-center" colspan="1">
      ${partArray[9] || " "}
      </td>
      <td class="border border-dark text-center" colspan="1">
      ${partArray[10] || " "}
      </td>
      <td class="border border-dark text-center" colspan="1">
      ${partArray[11] || " "}
      </td>
    </tr>
    <tr>
      <td class="border border-dark " colspan="1">
        1
      </td>
      <td class="border border-dark " colspan="2">
        Сүлжигч
      </td>
      <td class="border border-dark text-center" colspan="3">${accompaniments.knitter.lastName?.slice(
        0,
        1
      )}.${accompaniments.knitter.firstName}</td>
      <td class="border border-dark text-center" colspan="3"></td>
      <td class="border border-dark " colspan="4" rowspan="3">
        Сүлжигчийн чанар шалгагч
      </td>
      <td class="border border-dark text-center" colspan="4">
        Сүлжихийн деталийн тоо
      </td>
    </tr>
    <tr>
      <td class="border border-dark  " colspan="1">
        2
      </td>
      <td class="border border-dark" colspan="2">
        Тууз
      </td>
      <td class="border border-dark text-center" colspan="3"></td>
      <td class="border border-dark text-center" colspan="3"></td>

      <td class="border border-dark text-center" colspan="1">
        1
      </td>
      <td class="border border-dark text-center" colspan="2">
        Ар
      </td>
      <td class="border border-dark text-center" colspan="1"></td>
    </tr>
    <tr>
      <td class="border border-dark  " colspan="1">
        3
      </td>
      <td class="border border-dark " colspan="2">
        Нөхөн засвар
      </td>
      <td class="border border-dark text-center" colspan="3"></td>
      <td class="border border-dark text-center" colspan="3"></td>

      <td class="border border-dark text-center" colspan="1">
        2
      </td>
      <td class="border border-dark text-center" colspan="2">
        Энгэр
      </td>
      <td class="border border-dark text-center" colspan="1"></td>
    </tr>
    <tr>
      <td class="border border-dark " colspan="1">
        4
      </td>
      <td class="border border-dark " colspan="2">
        Их Бие
      </td>
      <td class="border border-dark text-center" colspan="6"></td>
      <td
        class="border border-dark text-center"
        colspan="4"
        rowspan="7"
      >
        Оёхын чанар шалгагч
      </td>
      <td class="border border-dark text-center" colspan="1">
        3
      </td>
      <td class="border border-dark text-center" colspan="2">
        Ханцуй
      </td>
      <td class="border border-dark text-center" colspan="1"></td>
    </tr>
    <tr>
      <td class="border border-dark " colspan="1">
        5
      </td>
      <td class="border border-dark " colspan="2">
        Манжет
      </td>
      <td class="border border-dark text-center" colspan="6"></td>
      <td class="border border-dark text-center" colspan="1">
        4
      </td>
      <td class="border border-dark text-center" colspan="2">
        Зах
      </td>
      <td class="border border-dark text-center" colspan="1"></td>
    </tr>
    <tr>
      <td class="border border-dark  " colspan="1">
        6
      </td>
      <td class="border border-dark " colspan="2">
        Зах холбох
      </td>
      <td class="border border-dark text-center" colspan="6"></td>
      <td class="border border-dark text-center" colspan="1">
        5
      </td>
      <td class="border border-dark text-center" colspan="2">
        Малгай
      </td>
      <td class="border border-dark text-center" colspan="1"></td>
    </tr>
    <tr>
      <td class="border border-dark text-center" colspan="1">
        7
      </td>
      <td class="border border-dark" colspan="2">
        Шидээс
      </td>
      <td class="border border-dark text-center" colspan="6"></td>
      <td class="border border-dark text-center" colspan="1">
        6
      </td>
      <td class="border border-dark text-center" colspan="2">
        Захны эмжээр
      </td>
      <td class="border border-dark text-center" colspan="1"></td>
    </tr>
    <tr>
      <td class="border border-dark text-center" colspan="1">
        8
      </td>
      <td class="border border-dark" colspan="2">
        Тууз
      </td>
      <td class="border border-dark text-center" colspan="6"></td>
      <td class="border border-dark text-center" colspan="1">
        7
      </td>
      <td class="border border-dark text-center" colspan="2">
        Мөрний эмжээр
      </td>
      <td class="border border-dark text-center" colspan="1"></td>
    </tr>
    <tr>
      <td class="border border-dark text-center" colspan="1">
        9
      </td>
      <td class="border border-dark" colspan="2">
        Эмжээр
      </td>
      <td class="border border-dark text-center" colspan="6"></td>
      <td class="border border-dark text-center" colspan="1">
        8
      </td>
      <td class="border border-dark text-center" colspan="2">
        Карма
      </td>
      <td class="border border-dark text-center" colspan="1"></td>
    </tr>
    <tr>
      <td class="border border-dark text-center" colspan="1">
        10
      </td>
      <td class="border border-dark" colspan="2">
        Халаас
      </td>
      <td class="border border-dark text-center" colspan="6"></td>
      <td class="border border-dark text-center" colspan="1">
        9
      </td>
      <td class="border border-dark text-center" colspan="2">
        Карманы эмжээр
      </td>
      <td class="border border-dark text-center" colspan="1"></td>
    </tr>
    <tr>
      <td class="border border-dark text-center" colspan="1">
        11
      </td>
      <td class="border border-dark" colspan="2">
        Гар оёо
      </td>
      <td class="border border-dark text-center" colspan="6"></td>
      <td
        class="border border-dark text-center"
        colspan="4"
        rowspan="2"
      >
        Угаах чанар шалгагч
      </td>
      <td class="border border-dark text-center" colspan="1">
        10
      </td>
      <td class="border border-dark text-center" colspan="2">
        Энгэр эмжээр
      </td>
      <td class="border border-dark text-center" colspan="1"></td>
    </tr>
    <tr>
      <td class="border border-dark text-center" colspan="1">
        12
      </td>
      <td class="border border-dark text-center" colspan="2">
        Угаалга
      </td>
      <td class="border border-dark text-center" colspan="6"></td>
      <td class="border border-dark text-center" colspan="1">
        11
      </td>
      <td class="border border-dark text-center" colspan="2">
        Шидээсны эмжээр
      </td>
      <td class="border border-dark text-center" colspan="1"></td>
    </tr>
    <tr>
      <td class="border border-dark text-center" colspan="1">
        13
      </td>
      <td class="border border-dark text-center" colspan="2">
        Индүү хуурамч
      </td>
      <td class="border border-dark text-center" colspan="6"></td>
      <td
        class="border border-dark text-center"
        colspan="4"
        rowspan="4"
      >
        Дундын чанар
      </td>
      <td class="border border-dark text-center" colspan="1">
        12
      </td>
      <td class="border border-dark text-center" colspan="2">
        Малгайн эмжээр
      </td>
      <td class="border border-dark text-center" colspan="1"></td>
    </tr>
    <tr>
      <td class="border border-dark text-center" colspan="1">
        14
      </td>
      <td class="border border-dark text-center" colspan="2">
        Гар оёо
      </td>
      <td class="border border-dark text-center" colspan="6"></td>
      <td class="border border-dark text-center" colspan="1">
        13
      </td>
      <td class="border border-dark text-center" colspan="2">
        Ханцуй суга эмжээр
      </td>
      <td class="border border-dark text-center" colspan="1"></td>
    </tr>
    <tr>
      <td class="border border-dark text-center" colspan="1">
        15
      </td>
      <td class="border border-dark" colspan="2">
        Нөхөн засвар
      </td>
      <td class="border border-dark text-center" colspan="6"></td>
      <td class="border border-dark text-center" colspan="1">
        14
      </td>
      <td class="border border-dark text-center" colspan="2">
        Тууз
      </td>
      <td class="border border-dark text-center" colspan="1"></td>
    </tr>
    <tr>
      <td class="border border-dark text-center" colspan="1">
        16
      </td>
      <td class="border border-dark" colspan="2">
        Шулуун оёо
      </td>
      <td class="border border-dark text-center" colspan="6"></td>
      <td class="border border-dark text-center" colspan="1">
        15
      </td>
      <td class="border border-dark text-center" colspan="2">
        Бүч
      </td>
      <td class="border border-dark text-center" colspan="1"></td>
    </tr>
    <tr>
      <td class="border border-dark text-center" colspan="1">
        17
      </td>
      <td class="border border-dark" colspan="2">
        Нүхлэх
      </td>
      <td class="border border-dark text-center" colspan="6"></td>
      <td
        class="border border-dark text-center"
        colspan="8"
        rowspan="2"
      >
        ГБЦ-ын чанар шалгагч
      </td>
    </tr>
    <tr>
      <td class="border border-dark text-center" colspan="1">
        18
      </td>
      <td class="border border-dark" colspan="2">
        Товч хадах
      </td>
      <td class="border border-dark text-center" colspan="6"></td>
    </tr>
    <tr>
      <td class="border border-dark text-center" colspan="1">
        19
      </td>
      <td class="border border-dark" colspan="2">
        Нөхөн засвар
      </td>
      <td class="border border-dark text-center" colspan="6"></td>
      <td
        class="border border-dark text-center"
        colspan="8"
        rowspan="3"
      >
        Технологичийн тэмдэглэл
      </td>
    </tr>
    <tr>
      <td class="border border-dark text-center" colspan="1">
        20
      </td>
      <td class="border border-dark" colspan="2">
        Индүү гоёл
      </td>
      <td class="border border-dark text-center" colspan="6"></td>
    </tr>
    <tr>
      <td class="border border-dark text-center" colspan="1">
        21
      </td>
      <td class="border border-dark text-center" colspan="2">
        Гар оёо
      </td>
      <td class="border border-dark text-center" colspan="6"></td>
    </tr>
    <tr>
      <td class="border border-dark text-center" colspan="6">
        ${accompaniments.barcode}
      </td>
      <td class="border border-dark text-center" colspan="2">
        Захиалга
      </td>
      <td class="border border-dark text-center" colspan="14">
        ${orders.client.name}
      </td>
    </tr>
    <tr>
      <td
        class="border border-dark text-center"
        colspan="6"
        rowspan="3"
      >
        ${orders.daimond || ""}
      </td>
      <td class="border border-dark text-center" colspan="2">
        Загвар
      </td>
      <td class="border border-dark text-center" colspan="3">
      ${orders.style.modelType.name}
      </td>
      <td class="border border-dark text-center" colspan="4">
      ${orders.style.modelNomer}
      </td>
      <td class="border border-dark text-center" colspan="1">
        Хэмжээ
      </td>
      <td class="border border-dark text-center" colspan="1">
        ${orders.size.name}
      </td>
    </tr>
    <tr>
      <td class="border border-dark text-center" colspan="2">
        Өнгө
      </td>
      <td class="border border-dark text-center" colspan="7">
        ${orders.style.colorCode}
      </td>
      <td class="border border-dark text-center" colspan="1">
        Гейч
      </td>
      <td class="border border-dark text-center" colspan="1">
        ${orders.style.gage.name}
      </td>
    </tr>
    <tr>
      <td class="border border-dark text-center" colspan="2">
        Түүхий эд
      </td>
      <td class="border border-dark text-center" colspan="7">
      ${orders.style.material.name}
      </td>
      <td class="border border-dark text-center" colspan="1">
        Тоо
      </td>
      <td class="border border-dark text-center" colspan="1">
        ${accompaniments.quantity}
      </td>
    </tr>
  </table>
  <div class="text-center">
    <img
      src="https://boostersback.com/upload/style/style_08a7851d-cb3a-4382-9730-877ec4208ad7.jpg"
      height="150px"
      width="150px"
      style="margin-top: 20px"
    />
  </div>
</div>`;
};

export default AccompHtml;
