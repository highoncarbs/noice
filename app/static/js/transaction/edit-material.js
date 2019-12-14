const MaterialForm = ({
    template: '#material_form',
    data() {
        return {
            dataUom: [],
            pp_num: null,

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
            current_uom_oth: null,

            raw_goods_inputs_temp: [],
            finished_goods_inputs_temp: [],
            accessories_goods_inputs_temp: [],
            other_goods_inputs_temp: []

        }
    },
    delimiters: ['[[', ']]'],
    mounted() {
        let path_array = window.location.pathname.split("/")
        let pp_num = path_array[path_array.length - 1]
        this.pp_num = pp_num

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



        try {


            let self = this

            axios.get('/transaction/get/materials/' + String(pp_num))
                .then(function (response) {
                    if (response.data) {
                        payload = JSON.parse(response.data)[0]

                        let counter = 0
                        self.raw_goods_inputs_temp = payload['raw_materials']

                        self.finished_goods_inputs_temp = payload['finished_materials']
                        self.accessories_goods_inputs_temp = payload['accessories_materials']
                        self.other_goods_inputs_temp = payload['other_materials']

                        self.raw_goods_inputs_temp.forEach(function (item) {
                            self.raw_goods_inputs.push({ 'goods': item.raw_mat[0].id, 'qty': item.quantity, 'uom': item.raw_mat[0].uom[0].name, 'temp': true })
                            counter++

                        })
                        self.finished_goods_inputs_temp.forEach(function (item) {
                            self.finished_goods_inputs.push({ 'goods': item.finished_mat[0].id, 'qty': item.quantity, 'uom': item.finished_mat[0].uom[0].name, 'temp': true })
                            counter++

                        })
                        self.accessories_goods_inputs_temp.forEach(function (item) {
                            self.accessories_goods_inputs.push({ 'goods': item.accessories_mat[0].id, 'qty': item.quantity, 'uom': item.accessories_mat[0].uom[0].name, 'temp': true })
                            counter++

                        })
                        self.other_goods_inputs_temp.forEach(function (item) {
                            self.other_materials_goods_inputs.push({ 'goods': item.other_mat[0].id, 'qty': item.quantity, 'uom': item.other_mat[0].uom[0].name, 'temp': true })
                            counter++

                        })


                    }
                })
                .catch(function (error) {
                    console.log(error)
                    self.$buefy.snackbar.open({
                        duration: 4000,
                        message: "Unable to load data",
                        type: 'is-light',
                        position: 'is-top-right',
                        actionText: 'Close',
                        queue: true,
                        onAction: () => {
                            this.isActive = false;
                        }
                    })


                })



        }
        catch (error) {
            console.log("Unable to load data from Endpoint" + String(error))
        }

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
        findAndSetRawGoods(id) {
            return this.data_raw_goods.find(item => item.id === id)
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
        findAndSetFinishedGoods(id) {
            return this.data_finished_goods.find(item => item.id === id)
        },
        setFinishedGoods(option) {
            this.finished_goods_inputs[this.current_finished].goods = option.id
            this.finished_goods_inputs[this.current_finished].uom = option.uom[0].name
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
        findAndSetAccessoriesGoods(id) {
            return this.data_accessories_goods.find(item => item.id === id)
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
        findAndSetOtherGoods(id) {
            return this.data_other_materials_goods.find(item => item.id === id)
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
        update() {

            let self = this
            let selectedData = []
            selectedData.push({ 'raw_inputs': this.raw_goods_inputs })
            selectedData.push({ 'finished_inputs': this.finished_goods_inputs })
            selectedData.push({ 'accessories_inputs': this.accessories_goods_inputs })
            selectedData.push({ 'other_materials_inputs': this.other_materials_goods_inputs })
            axios.post('/transaction/update/materials/' + + String(this.pp_num), JSON.stringify(selectedData), {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(function (response) {
                    try {
                        if (response.data.success) {
                            self.$buefy.snackbar.open({
                                duration: 4000,
                                message: "Data updated",
                                type: 'is-light',
                                position: 'is-top-right',
                                actionText: 'Close',
                                queue: true,
                                onAction: () => {
                                    this.isActive = false;
                                }
                            })
                        }
                        else {
                            self.$buefy.snackbar.open({
                                duration: 4000,
                                message: "Something went wrong",
                                type: 'is-light',
                                position: 'is-top-right',
                                actionText: 'Close',
                                queue: true,
                                onAction: () => {
                                    this.isActive = false;
                                }
                            })
                        }
                    }
                    catch (error) {
                        console.log('Error sending JSON data - activity list' + String(error))
                    }
                })
        },

        next() {
            try {


                this.$router.push('/edit-activity')

            }
            catch (error) {
                console.log('Error sending JSON data - activity list')
            }
        },
        previous() {
            try {
                // if (this.activity_list.length != 0) {

                //     localStorage.setItem('activity', JSON.stringify(this.activity_list))
                // }
                this.$router.push('/edit-basic')
            }
            catch (error) {
                console.log('Unable to save data - ' + String(error))
            }
        }




    }
})