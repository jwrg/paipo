module.exports = {
  /**
   * Save data entry
   *
   * This handles POST requests from the new entry and
   * edit entry views
   */
  saveEntry: (datum) => {
    /**
     * THIS NEEDS TO BE GENERALIZED
     *
     * This app is for scaffolding so the data
     * should have little to no flavour.
     *
     * Data entries will all have a date and an id
     *
     * Otherwise the fields will just be field_1, field_2,
     * et cetera
     *
     * The view will allow the user to add more fields, two
     * being the default displayed
     *
     * The added fields will be in a sub-object under the
     * main object, to illustrate how to pack data using
     * underscores (BE SURE TO TEST FOR INJECTION)
     */
    console.log(datum);
  }
};
