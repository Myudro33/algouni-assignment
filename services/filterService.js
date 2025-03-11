const filterService = (query,reqQuery)=>{
    let filteredQuery = query
const productQueryFilters = ['name','price','stock','description','category']
const filters = {}
productQueryFilters.forEach((el)=>{
    if(reqQuery[el]){
        filters[el]=reqQuery[el]
    }
})
filteredQuery = query.find(filters)

if(reqQuery.sort){
    filteredQuery = filteredQuery.sort(reqQuery.sort)
}
if(reqQuery.fields){
    filteredQuery = filterService.select(reqQuery.fields.split(",").join(" "))
}
const page = reqQuery.page*1||1
const limit = reqQuery.limit*1||100
const skip = (page-1)*limit
filteredQuery= filteredQuery.skip(skip).limit(limit)

return filteredQuery
}


export default filterService