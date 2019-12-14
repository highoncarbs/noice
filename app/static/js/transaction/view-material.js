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
        try {
            let path_array = window.location.pathname.split("/")
            let pp_num = path_array[path_array.length - 1]

            let self = this
            axios.get('/transaction/get/materials/' + String(pp_num))
                .then(function (response) {

                    if (response.data) {
                        payload = JSON.parse(response.data)[0]
                        
                        console.log(payload)
                        self.raw_goods_inputs = payload['raw_materials']
                        self.finished_goods_inputs = payload['finished_materials']
                        self.other_materials_goods_inputs = payload['other_materials']
                        self.accessories_goods_inputs = payload['accessories_materials']
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

        },
        submitData() {
            let basic_id = JSON.parse(localStorage.getItem('basic'))[3]
            let activity_id = JSON.parse(localStorage.getItem('activity'))[0]

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
                            self.$router.push('/material')

                        }
                    }
                    catch (error) {
                        console.log('Error sending JSON data - activity list' + String(error))
                    }
                })
        },

        next() {
            try {


                this.$router.push('/view-material')

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
                this.$router.push('/view-basic')
            }
            catch (error) {
                console.log('Unable to save data - ' + String(error))
            }
        }
       



    }
})