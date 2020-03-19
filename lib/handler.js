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
  /**
    // Change empty strings to nulls
    for (key in ctx.request.body) {
      if (ctx.request.body[key] === '') ctx.request.body[key] = null;
    }
    // Parse the data into a JSON obj
    var obj = {};
    created = new Date(ctx.request.body['created']);
    obj.created = created.toJSON();
    release = new Date(Date.parse(ctx.request.body['releasedate'] + 'T' + ctx.request.body['releasetime'] + 'Z'));
    obj.release = release.toJSON();
    obj.expected = parseFloat(ctx.request.body['expected']);
    obj.actual = ctx.request.body['actual'];
    obj.brand = ctx.request.body['brand'];
    obj.model = ctx.request.body['model'];
    obj.comment = ctx.request.body['comment'];
    // Populate individual orders using regex
    obj.want = {};
    let reColour = /colour(\d+)/;
    let reStyle = /style(\d+)/;
    let reSize = /size(\d+)\_(\d+)/;
    let reStore = /store(\d+)_(\d+)/;
    for (key in ctx.request.body) {
      let matchColour = reColour.exec(key);
      let matchStyle = reStyle.exec(key);
      let matchSize = reSize.exec(key);
      let matchStore = reStore.exec(key);
      if (matchColour) {
        Object.assign(obj.want, { [matchColour[1]]: { colour: ctx.request.body[key] }});
      } else if (matchStyle) {
        Object.assign(obj.want[matchStyle[1]], { style: ctx.request.body[key] });
      } else if (matchSize) {
        if (obj.want[matchSize[1]].sizes) {
          Object.assign(obj.want[matchSize[1]].sizes, { [matchSize[2]]: parseFloat(ctx.request.body[key]) });
        } else {
          obj.want[matchSize[1]].sizes = { [matchSize[2]]: parseFloat(ctx.request.body[key]) };
        }
      } else if (matchStore) {
        if (obj.want[matchStore[1]].stores) {
          Object.assign(obj.want[matchStore[1]].stores, { [matchStore[2]]: ctx.request.body[key] });
        } else {
          obj.want[matchStore[1]].stores = { [matchStore[2]]: ctx.request.body[key] };
        }
      }
    }
    // Are we updating a record, or making a new one?
    // First, change the record in memory
    var equality = false;
    if (ctx.request.body['id'] == 'null') {
      // New record
      ctx.request.body['id'] = parseInt(ctx.state.releases) + 1;
      ctx.state.data[ctx.request.body['id']] = {};
      obj.created = toString(ctx.state.now);
    } else {
      // Updating a record
      // Check whether the new data is the same as the old data
      equality = JSON.stringify(obj) === JSON.stringify(ctx.state.data[ctx.request.body['id']]);
    }
    // Write changes to disk.  Every request loads a new copy
    // of the data.  This is a shitty way to do it but it's ok
    // for now since we are single user.  When we are multi-
    // user we will move to a db to mitigate race conditions.
    if (!equality) {
      // Only update the entry if we are certain that it's 
      // been changed or if it's a new entry
      Object.assign(ctx.state.data[ctx.request.body['id']], obj);
      // Finally write to disk
      fs.writeFileSync(dataPath, JSON.stringify(ctx.state.data), 'utf8');
    }
  }
  /**
   * Delete data entry
   */
}
