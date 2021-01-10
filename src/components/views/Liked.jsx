import React, { useState, useEffect, useContext } from "react";

import SingleCard from "./Card";
import { Container } from "react-bootstrap";
import { movieAPI as API } from "../../API";
import { db } from "../../firebase";
import { AuthContext } from "../../Auth";
const Liked = () => {
  const { currentUser } = useContext(AuthContext);
  const [cardsDisplay, setCardsDisplay] = useState([]);
  useEffect(() => {
    // get firebase likes
    const likes = [];
    const likesRef = db
      .collection("liked")
      .doc(currentUser)
      .collection("likes");
    const refCollect = async () => {
      await likesRef.get().then((snap) => {
        snap.docs.forEach((doc) => {
          likes.push(doc.data().id);
        });
      });
      console.log(likes);
      likes.forEach((item) => {
        fetch(`${API.details}${item}?api_key=${API.key}&language=en-US`)
          .then((res) => res.json())
          .then((res) => {
            console.log(res);
            setCardsDisplay((state) => [...state, res]);
          });
      });
    };
    refCollect();
  }, [currentUser]);
  return (
    <Container>
      {cardsDisplay.map((card) => {
        return (
          <SingleCard
            title={card.title}
            img={`${API.image}${card.backdrop_path}`}
            key={card.id}
            id={card.id}
          />
        );
      })}
    </Container>
  );
};

export default Liked;
