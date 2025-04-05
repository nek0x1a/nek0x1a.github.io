import Badge from "@site/src/components/Badge";
import { basicTypeStyle } from "@site/src/types/basictypes";

const types: basicTypeStyle[] = [
  "primary",
  "secondary",
  "success",
  "info",
  "warning",
  "danger",
];

const stylesElements = types.map((item, index) => (
  <Badge label={item} type={item} key={index} />
));

export default function ButtonGallery() {
  return <div className="flex gap-4">{stylesElements}</div>;
}
