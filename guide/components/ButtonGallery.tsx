import Button, {
  type ButtonSize,
  type ButtonState,
  type ButtonType,
} from "@site/src/components/Button";

const size: ButtonSize[] = ["sm", "md", "lg"];
const types: ButtonType[] = [
  "primary",
  "secondary",
  "success",
  "info",
  "warning",
  "danger",
  "link",
];
const states: ButtonState[] = ["outline", "active"];

const sizeElements = size.map((item, index) => (
  <span key={index}>
    <Button size={item}>按钮</Button>
  </span>
));

const stylesElements = [
  <div className="flex gap-4 mb-4" key="A">
    {types.map((item, index) => (
      <Button buttonType={item} key={index}>
        按钮
      </Button>
    ))}
  </div>,
  ...states.map((state, k1) => (
    <div className="flex gap-4 mb-4" key={`B${k1}`}>
      {types.map((item, k2) => (
        <Button buttonType={item} state={state} key={k2}>
          按钮
        </Button>
      ))}
    </div>
  )),
  <div className="flex gap-4 mb-4" key="C">
    {types.map((item, index) => (
      <Button disabled buttonType={item} key={index}>
        按钮
      </Button>
    ))}
  </div>,
  <div className="flex flex-wrap gap-4 mb-4" key="D">
    {types.map((item, index) => (
      <Button block buttonType={item} key={index}>
        按钮
      </Button>
    ))}
  </div>,
];
export default function ButtonGallery() {
  return (
    <div>
      <div className="flex gap-4 mb-4">{sizeElements}</div>
      {stylesElements}
    </div>
  );
}
