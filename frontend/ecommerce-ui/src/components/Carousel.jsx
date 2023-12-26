/* eslint-disable react/prop-types */
import Carousel from "react-material-ui-carousel";
import { Paper, Button } from "@mui/material";
import "../App.css";

function Item(props) {
  return (
    <Paper>
      <img className="img-carousel" src={props.item.img_url} />
      <h2>{props.item.name}</h2>
      <p>{props.item.description}</p>

      <Button className="CheckButton">Check it out!</Button>
    </Paper>
  );
}

export default function CarouselComponent() {
  var items = [
    {
      name: "Random Name #1",
      description: "Probably the most random thing you have ever seen!",
      img_url:
        "https://images.pexels.com/photos/9992349/pexels-photo-9992349.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    {
      name: "Random Name #2",
      description: "Hello World!",
      img_url:
        "https://images.pexels.com/photos/9992330/pexels-photo-9992330.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
  ];

  return (
    <Carousel>
      {items.map((item, i) => (
        <Item key={i} item={item} />
      ))}
    </Carousel>
  );
}
