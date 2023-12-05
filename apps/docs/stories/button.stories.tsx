import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@radial-ui/react";

const meta: Meta<typeof Button> = {
  component: Button,
  argTypes: {
    type: {
      control: { type: "radio" },
      options: ["button", "submit", "reset"],
    },
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/react/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  render: (props) => (
    <Button className="cualquier-cosa" color="success" variant="text" sx={{
      color: 'red',
      display: 'inline',
      fontWeight: 'bold',
      fontSize: 14,
      padding: 10,
      backgroundColor: 'blue'
    }}
      {...props}
      onClick={(): void => {
        // eslint-disable-next-line no-alert -- alert for demo
        alert("Esto es un alert!");
      }}
    >
      Hello
    </Button>
  ),
  name: "Button",
  args: {
    children: "Hello",
/*     style: {
      color: "blue",
      border: "1px solid gray",
      padding: 10,
      borderRadius: 10,
    }, */
  },
};
