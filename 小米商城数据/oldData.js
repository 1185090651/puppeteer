/**
let data = {
    name:'新品',
    id:653,
    items:[
        {
            img_url:"xxxx",
            category_name:"手机",
            product_name:"小米10",
            product_id:10000213
        }
    ]
}
 */
const fs = require('fs')

// 定义全局索引
let index = 0;
// 定义存储全部全部数据的数组
let global_arr = [];

// 读出全部数据
let str = fs.readFileSync('./oldData.json','utf-8')

// 转对象
let arrCategory = JSON.parse(str)

// console.log(arrCategory.length);

function category(arr){
    let obj = {};
    obj.id = arr[index].category_id
    obj.name = arr[index].category_name
    global_arr.push(obj)
    obj.items = []
    arr[index].category_list.forEach(i => {
        if (i.view_type === "category_group") {
            obj.items.push(i)
        }
    })
    itemCategory(obj)
    // fs.writeFileSync('./test.json',JSON.stringify(obj))
    // // console.log(global_arr);
    // // itemCategory(obj.items,arr)
    // return obj
    index ++
}

// let a = category(arrCategory)

function itemCategory(obj) {
    let items_arr = []
    obj.items.forEach(i => {
        i.body.items.forEach(ii => {
            let items_obj = {}
            items_obj.img_url = `https:${ii.img_url}`
            items_obj.category_name = ii.category_name
            items_obj.product_name = ii.product_name
            items_obj.product_i = ii.action.path
            items_arr.push(items_obj)
        }) 
    })
    // console.log(items_arr);
    // fs.writeFileSync('./test1.json',JSON.stringify(items_arr))
    obj.items = items_arr
    // fs.writeFileSync('./test1.json',JSON.stringify(obj))
}

// itemCategory(a)
while(arrCategory[index]) {
    category(arrCategory)
}

fs.writeFileSync('./test1.json',JSON.stringify(global_arr))
