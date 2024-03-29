export function getData(data, index, column) {
  const lc = column.toLowerCase();
  const cIndex = data.fields.findIndex((v) => v.name == lc);
  if (cIndex == null) return null;
  return data.rows[index][cIndex];
}

function getFields(response) {
  const arr = [];
  for (let i = 0; i < response.fields.length; i++) {
    const field = response.fields[i];
    arr.push({ name: field.name, type: field.dataTypeID });
  }
  return arr;
}

export async function toArray (response, onItem) {
  const items = [];
  for (let index = 0; index < response.rows.length; index++) {
    const row = response.rows[index];

    let item = response.fields.reduce((initValue, field, index) => {
      initValue[field.name] = convert(field, row[index]);
      return initValue;
    }, {});

    if (onItem != null) {
      let rItem = await onItem(item, row, index);
      if (rItem !== undefined) item = rItem;
    }
    items.push(item);
  }
  return items;
}

export function toHash(response, key = 'id', onItem) {
  return response.rows.reduce((rowHash, row) => {
    const data = response.fields.reduce((colHash, field, index) => {
      colHash[field.name] = convert(field, row[index]);
      return colHash;
    }, {});
    const keyValue = data[key];
    if (keyValue === undefined) throw new Error('The value of field ' + key + ' is undefined');
    rowHash[keyValue] = data;
    if (onItem != null) {
      const result = onItem(data, row);
      if (result !== undefined) rowHash[keyValue] = data;
    }
    return rowHash;
  }, {});
}


export function formatResponse(response) {
  const res = { fields: getFields(response), rows: response.rows };
  if (response.highlights != null) res.highlights = response.highlights;
  return res;
}

export function formatSqlQuery(query, params) {
  let str = query.replace(/\$(\d+)/g, function (_, param) {
    const pm = Number(param);
    if (isNaN(pm)) return 'invalid parameter';
    return params[pm - 1];
  });
  str = str.replace(/\),/g, '),\n');
  str = str.replace(/\s+/g, ' ');
  return str;
}