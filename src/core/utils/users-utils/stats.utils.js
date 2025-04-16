import { format } from 'date-fns'

export function prepareProduct(products) {
  return {
    type: 'bar',
    _legend: false,
    data: {
      labels: products.map(function (product) {
        return product.product_description
      }),
      datasets: [
        Object.assign(
          {
            data: products.map(function (product) {
              return product.total
            }),
            tension: 0.4
          },
          randomColors(products.length)
        )
      ]
    }
  }
}

export function prepareMonthly(products) {
  return {
    type: 'line',
    _legend: true,
    data: {
      labels: products[0].detail.map(function (detail) {
        return format(new Date(detail.date), 'MMMM')
      }),
      datasets: products.map(function (product) {
        return Object.assign(
          {
            label: product.product_description,
            data: product.detail.map(function (detail) {
              return detail.total
            }),
            tension: 0.4
          },
          randomColors(1)
        )
      })
    }
  }
}

export function prepareDaily(products) {
  return {
    type: 'line',
    _legend: true,
    data: {
      labels: products[0].detail.map(function (detail) {
        return format(new Date(detail.date), 'd MMM')
      }),
      datasets: products.map(function (product) {
        return Object.assign(
          {
            label: product.product_description,
            data: product.detail.map(function (detail) {
              return detail.total
            }),
            tension: 0.4
          },
          randomColors(1)
        )
      })
    }
  }
}

function randomColors(num) {
  var length = num || 1,
    data = {
      borderColor: [],
      backgroundColor: []
    },
    r,
    g,
    b

  for (var i = 0; i < length; i++) {
    r = Math.floor(Math.random() * 255)
    g = Math.floor(Math.random() * 255)
    b = Math.floor(Math.random() * 255)

    data.borderColor.push('rgb(' + r + ', ' + g + ', ' + b + ')')
    data.backgroundColor.push('rgba(' + r + ', ' + g + ', ' + b + ', 0.5)')
  }

  return data
}

export function normalizeStatsData(group_by, data) {
  const confgs = { product: prepareProduct, monthly: prepareMonthly, daily: prepareDaily }
  const modifyData = {
    chart: { data: null, options: null },
    table: { headers: null, data: null }
  }
  modifyData.chart.data = group_by && data?.length ? confgs[group_by](data) : null
  modifyData.chart.options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        display: modifyData.chart.data._legend
      },
      title: {
        display: false
      }
    }
  }
  modifyData.table.headers = [{ header: 'Service', field: 'product_description' }].concat(
    data.at(0)?.detail.map((el) => {
      return {
        field: el.date,
        header:
          group_by === 'daily'
            ? format(new Date(el.date), 'd MMM')
            : group_by === 'monthly'
            ? format(new Date(el.date), 'MMMM')
            : 'quantity'
      }
    })
  )
  modifyData.table.data = data.map((el) => {
    const newTableData = el.detail.reduce(
      (acc, item) => {
        acc[item.date] = item.total
        return acc
      },
      { product_description: el.product_description }
    )
    return newTableData
  })
  return modifyData
}
