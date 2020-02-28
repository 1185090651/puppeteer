const fs = require('fs')



let data = fs.readFileSync('./newData.json','utf-8')
data = JSON.parse(data)

let arr = []

data.forEach(item => {
    item.items.forEach(i => {
        i.rid = item.id
        arr.push(i)
    })
})



fs.writeFileSync('./new.json',JSON.stringify(arr))
