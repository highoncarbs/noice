const MaterialForm = ({
    template: '#material_form',
    data() {
        return {
            dataUom: [],
            loader: false,
            raw_goods_inputs: [],
            data_raw_goods: [],
            dataRawGoods: [],
            current_raw: null,
            current_uom: null,

            finished_goods_inputs: [],
            data_finished_goods: [],
            dataFinishedGoods: [],
            current_finished: null,
            current_uom_fin: null,

            accessories_goods_inputs: [],
            data_accessories_goods: [],
            dataAccessoriesGoods: [],
            current_accessories: null,
            current_uom_acc: null,

            other_materials_goods_inputs: [],
            data_other_materials_goods: [],
            dataOtherMaterialsGoods: [],
            current_other_materials: null,
            current_uom_oth: null

        }
    },
    delimiters: ['[[', ']]'],
    mounted() {
        let raw = this
        axios.get('/main_master/get/raw_goods')
            .then(function (response) {
                raw.data_raw_goods = response.data
                raw.dataRawGoods = raw.data_raw_goods
            })
            .catch(function (error) {
                console.log(error)
                raw.$buefy.snackbar.open({
                    duration: 4000,
                    message: 'Unable to fetch data for Raw Goods',
                    type: 'is-light',
                    position: 'is-top-right',
                    actionText: 'Close',
                    queue: true,
                    onAction: () => {
                        this.isActive = false;
                    }
                })
            })
        axios.get('/main_master/get/finished_goods')
            .then(function (response) {
                raw.data_finished_goods = response.data
                raw.dataFinishedGoods = raw.data_finished_goods
            })
            .catch(function (error) {
                console.log(error)
                raw.$buefy.snackbar.open({
                    duration: 4000,
                    message: 'Unable to fetch data for Finished Goods',
                    type: 'is-light',
                    position: 'is-top-right',
                    actionText: 'Close',
                    queue: true,
                    onAction: () => {
                        this.isActive = false;
                    }
                })
            })
        axios.get('/main_master/get/accessories')
            .then(function (response) {
                raw.data_accessories_goods = response.data
                raw.dataAccessoriesGoods = raw.data_accessories_goods

            })
            .catch(function (error) {
                console.log(error)
                raw.$buefy.snackbar.open({
                    duration: 4000,
                    message: 'Unable to fetch data for Finished Goods',
                    type: 'is-light',
                    position: 'is-top-right',
                    actionText: 'Close',
                    queue: true,
                    onAction: () => {
                        this.isActive = false;
                    }
                })
            })
        axios.get('/main_master/get/other_materials')
            .then(function (response) {


                raw.data_other_materials_goods = response.data
                raw.dataOtherMaterialsGoods = raw.data_other_materials_goods

            })
            .catch(function (error) {
                console.log(error)
                raw.$buefy.snackbar.open({
                    duration: 4000,
                    message: 'Unable to fetch data for Finished Goods',
                    type: 'is-light',
                    position: 'is-top-right',
                    actionText: 'Close',
                    queue: true,
                    onAction: () => {
                        this.isActive = false;
                    }
                })
            })
        axios.get('/basic_master/get/uom')
            .then(function (response) {
                raw.data_uom = response.data
                raw.dataUom = raw.data_uom


            })
            .catch(function (error) {
                console.log(error)
                raw.$buefy.snackbar.open({
                    duration: 4000,
                    message: 'Unable to fetch data for UOM',
                    type: 'is-light',
                    position: 'is-top-right',
                    actionText: 'Close',
                    queue: true,
                    onAction: () => {
                        this.isActive = false;
                    }
                })
            })
    },
    computed: {

    },
    methods: {
        checkRawRow() {
            let self = this
            this.raw_goods_inputs.forEach(function (item) {
                console
                if (item.goods == '') {
                    self.$set(item.error, 'goods', true)
                }
                if (item.qty == '') {
                    self.$set(item.error, 'qty', true)
                }
            })
        },
        checkFinishedRow() {
            let self = this
            this.finished_goods_inputs.forEach(function (item) {
                console
                if (item.goods == '') {
                    self.$set(item.error, 'goods', true)
                }
                if (item.qty == '') {
                    self.$set(item.error, 'qty', true)
                }
            })
        },
        checkAccRow() {
            let self = this
            this.accessories_goods_inputs.forEach(function (item) {
                console
                if (item.goods == '') {
                    self.$set(item.error, 'goods', true)
                }
                if (item.qty == '') {
                    self.$set(item.error, 'qty', true)
                }
            })
        },
        checkOtherRow() {
            let self = this
            this.other_materials_goods_inputs.forEach(function (item) {
                console
                if (item.goods == '') {
                    self.$set(item.error, 'goods', true)
                }
                if (item.qty == '') {
                    self.$set(item.error, 'qty', true)
                }
            })
        },

        addRawRow() {
            this.raw_goods_inputs.push({
                goods: '',
                qty: '',
                uom: '',
                error: {}
            })
        },
        deleteRawRow(index) {
            this.raw_goods_inputs.splice(index, 1)
        },
        getRawGoods(name) {
            console.log('HEH - ' + name)

            if (!name.length) {
                this.dataRawGoods = this.data_raw_goods
                return
            }
            else {
                if (this.data_raw_goods.length != 0) {
                    this.dataRawGoods = this.data_raw_goods.filter(data => {
                        return data.gen_name.toLowerCase().includes(name.toLowerCase())
                    });

                }
            }

        },
        setRawGoods(option) {
            this.raw_goods_inputs[this.current_raw].goods = option.id
            this.raw_goods_inputs[this.current_raw].uom = option.uom[0].name
        },

        addFinishedRow() {
            this.finished_goods_inputs.push({
                goods: '',
                qty: '',
                uom: '',
                error: {}
            })
        },
        deleteFinishedRow(index) {
            this.finished_goods_inputs.splice(index, 1)
        },
        setFinishedGoods(option) {
            this.finished_goods_inputs[this.current_finished].goods = option.id
            this.finished_goods_inputs[this.current_finished].uom = option.uom[0].name
        },
        getFinishedGoods(name) {
            if (!name.length) {
                return this.dataFinishedGoods = this.data_finished_goods

            }
            else {
                if (this.data_finished_goods.length != 0) {
                    this.dataFinishedGoods = this.data_finished_goods.filter(data => {
                        return data.gen_name.toLowerCase().includes(name.toLowerCase())
                    });

                }
            }

        },
        addAccessoriesRow() {
            this.accessories_goods_inputs.push({
                goods: '',
                qty: '',
                uom: '',
                error: {}
            })
        },
        deleteAccessoriesRow(index) {
            this.accessories_goods_inputs.splice(index, 1)
        },
        getAccessoriesGoods(name) {
            if (!name.length) {
                this.dataAccessoriesGoods = this.data_accessories_goods
                return
            }
            else {
                if (this.data_accessories_goods.length != 0) {
                    this.dataAccessoriesGoods = this.data_accessories_goods.filter(data => {
                        return data.name.toLowerCase().includes(name.toLowerCase())
                    });

                }
            }

        },
        setAccessoriesGoods(option) {
            this.accessories_goods_inputs[this.current_accessories].goods = option.id
            this.accessories_goods_inputs[this.current_accessories].uom = option.uom[0].name
        },


        addOtherMaterialsRow() {
            this.other_materials_goods_inputs.push({
                goods: '',
                qty: '',
                uom: '',
                error: {}
            })
        },
        deleteOtherMaterialsRow(index) {
            this.other_materials_goods_inputs.splice(index, 1)
        },
        getOtherMaterialsGoods(name) {
            if (!name.length) {
                this.dataOtherMaterialsGoods = this.data_other_materials_goods
                return
            }
            else {
                if (this.data_other_materials_goods.length != 0) {
                    this.dataOtherMaterialsGoods = this.data_other_materials_goods.filter(data => {
                        return data.name.toLowerCase().includes(name.toLowerCase())
                    });

                }
            }

        },
        setOtherMaterial(option) {
            this.other_materials_goods_inputs[this.current_other_materials].goods = option.id
            this.other_materials_goods_inputs[this.current_other_materials].uom = option.uom[0].name
        },


        getUom(name) {
            if (!name.length) {
                this.dataUom = []
                return
            }
            else {
                if (this.data_uom.length != 0) {
                    this.dataUom = this.data_uom.filter(data => {
                        return data.name.toLowerCase().includes(name.toLowerCase())
                    });

                }
            }

        },
        checkData() {
            let self = this
            this.other_materials_goods_inputs.every(function (item) {

                if (item.error.goods == true) {
                    return false
                }
                if (item.error.qty == true) {
                    return false
                }
                return true
            })
            this.raw_goods_inputs.every(function (item) {

                if (item.error.goods == true) {
                    return false
                }

                if (item.error.qty == true) {
                    return false
                }
                return true
            })
            this.finished_goods_inputs.every(function (item) {

                if (item.error.goods == true) {
                    return false
                }

                if (item.error.qty == true) {
                    return false
                }
                return true
            })
            this.accessories_goods_inputs.every(function (item) {
                console.log(item)
                if (item.error.goods == true) {
                    return false
                }
                if (item.error.qty == true) {
                    return false
                }
                return true
            })

            
        },
        submitData() {
            this.checkRawRow()
            this.checkAccRow()
            this.checkFinishedRow()
            this.checkOtherRow()
            
            try {
                
           
                this.loader = true
                let basic_id = JSON.parse(localStorage.getItem('basic'))[1]
                let activity_id = JSON.parse(localStorage.getItem('activity'))[0]
                let self = this
                let selectedData = []
                selectedData.push({ 'raw_inputs': this.raw_goods_inputs })
                selectedData.push({ 'finished_inputs': this.finished_goods_inputs })
                selectedData.push({ 'accessories_inputs': this.accessories_goods_inputs })
                selectedData.push({ 'other_materials_inputs': this.other_materials_goods_inputs })
                selectedData.push(basic_id)
                selectedData.push(activity_id)
                axios.post('/transaction/add/materials', JSON.stringify(selectedData), {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(function (response) {
                        try {
                            if (response.data.success) {
                                console.log('Yippe kay yaya')
                                localStorage.removeItem('basic')
                                localStorage.removeItem('activity')
                                localStorage.removeItem('material')
                                window.location.href = '/reports/view'

                            }
                            self.loader = false
                        }
                        catch (error) {
                            self.loader = false
                            console.log('Error sending JSON data - activity list' + String(error))
                        }
                    })
            }
            catch (error) {
                
            }
        },
        previous() {
            try {
                let material = []
                material.push(this.raw_goods_inputs)
                material.push(this.finished_goods_inputs)
                material.push(this.accessories_goods_inputs)
                material.push(this.other_materials_goods_inputs)
                localStorage.setItem('material', JSON.stringify(material))
                this.$router.push('/activity')

            }
            catch (error) {
                console.log('Unable to save data - ' + String(error))
            }
        }




    }
})