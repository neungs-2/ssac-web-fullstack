import React from 'react';
import IngredientsList from './ingredients_list';
import Instructions from './instructions';

export default function Recipe({
  name = 'untitled',
  ingredients = [],
  steps = [],
}) {
  return (
    <section id={name.toLowerCase().replace(/ /g, '-')}>
      <h1>{name}</h1>
      <IngredientsList list={ingredients} />
      <Instructions title="Cooking Instructions" steps={steps} />
    </section>
  );
}
