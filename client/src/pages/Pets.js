import React, { useState } from "react";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";
import PetsList from "../components/PetsList";
import NewPetModal from "../components/NewPetModal";
import Loader from "../components/Loader";

const GET_PETS = gql`
  query GetPets {
    pets {
      id
      name
      type
      img
    }
  }
`;

const CREATE_A_PET = gql`
  mutation CreateAPet($newPet: NewPetInput!) {
    addPet(inputData: $newPet) {
      id
      name
      type
      img
    }
  }
`;

export default function Pets() {
  const [modal, setModal] = useState(false);
  const { data, loading, error } = useQuery(GET_PETS);
  const [
    createPet,
    { data: mutationData, loading: mutationLoading, error: mutationError },
  ] = useMutation(CREATE_A_PET);

  const onSubmit = (input) => {
    setModal(false);
    createPet({
      variables: { inputData: { name: input.name, type: input.type } },
    });
  };

  if (modal) {
    return <NewPetModal onSubmit={onSubmit} onCancel={() => setModal(false)} />;
  }

  if (loading || mutationLoading) {
    return <Loader />;
  }

  if (error || mutationError) {
    return <p>Error</p>;
  }

  return (
    <div className="page pets-page">
      <section>
        <div className="row between-xs middle-xs">
          <div className="col-xs-10">
            <h1>Pets</h1>
          </div>

          <div className="col-xs-2">
            <button onClick={() => setModal(true)}>new pet</button>
          </div>
        </div>
      </section>
      <section>
        <PetsList pets={data.pets} />
      </section>
    </div>
  );
}
