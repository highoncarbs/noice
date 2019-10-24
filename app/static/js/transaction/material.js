const MaterialForm = ({
    template: '#material_form',
    data() {
        return {
            dataUom: [],
            
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
        addRawRow() {
            this.raw_goods_inputs.push({
                goods: '',
                qty: '',
                uom: '',
            })
        },
        deleteRawRow(index) {
            this.raw_goods_inputs.splice(index, 1)
        },
        getRawGoods(name) {
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
        addFinishedRow() {
            this.finished_goods_inputs.push({
                goods: '',
                qty: '',
                uom: '',
            })
        },
        deleteFinishedRow(index) {
            this.finished_goods_inputs.splice(index, 1)
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
        addOtherMaterialsRow() {
            this.other_materials_goods_inputs.push({
                goods: '',
                qty: '',
                uom: '',
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

        }



    }
})