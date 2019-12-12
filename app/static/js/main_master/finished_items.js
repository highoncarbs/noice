new Vue({
    el: '#finished_items_master',
    data() {
        return {
            form: {
                product_category: '',
                fabric_combination: '',
                print_technique: '',
                design_number: '',
                uom: '',
                size: '',
                errors: {}
            },
            formID: {
                product_category: null,
                fabric_combination: null,
                print_technique: null,
                design_number: null,
                alt_name: null,
                uom: null,
                size: null,
                image: null
            },
            edit: {
                product_category: '',
                fabric_combination: '',
                print_technique: '',
                design_number: '',
                uom: '',
                size: '',
                image: null
            },
            editID: {
                product_category: null,
                fabric_combination: null,
                print_technique: null,
                design_number: null,
                alt_name: null,
                uom: null,
                size: null,
                image: null,
                id: null
            },
            data_product_category: [],
            data_fabric_combination: [],
            data_print_technique: [],
            data_design_number: [],
            data_uom: [],
            data_size: [],
            errors: {},
            view: true,
            data: [],
            fileSrc: null,
            viewUpload: false,
            modal: false
        }

    },
    delimiters: ['[[', ']]'],
    watch: {


    },
    mounted() {
        let raw = this
        axios.get('/basic_master/get/product_category')
            .then(function (response) {
                raw.data_product_category = response.data
            })
            .catch(function (error) {
                console.log(error)
                raw.$buefy.snackbar.open({
                    duration: 4000,
                    message: 'Unable to fetch data for Product Category',
                    type: 'is-light',
                    position: 'is-top-right',
                    actionText: 'Close',
                    queue: true,
                    onAction: () => {
                        this.isActive = false;
                    }
                })
            })
        axios.get('/basic_master/get/size_master')
            .then(function (response) {
                raw.data_size = response.data
            })
            .catch(function (error) {
                console.log(error)
                raw.$buefy.snackbar.open({
                    duration: 4000,
                    message: 'Unable to fetch data for Size',
                    type: 'is-light',
                    position: 'is-top-right',
                    actionText: 'Close',
                    queue: true,
                    onAction: () => {
                        this.isActive = false;
                    }
                })
            })
        axios.get('/basic_master/get/fabric_combination')
            .then(function (response) {
                raw.data_fabric_combination = response.data
            })
            .catch(function (error) {
                console.log(error)
                raw.$buefy.snackbar.open({
                    duration: 4000,
                    message: 'Unable to fetch data for Fabric Combination',
                    type: 'is-light',
                    position: 'is-top-right',
                    actionText: 'Close',
                    queue: true,
                    onAction: () => {
                        this.isActive = false;
                    }
                })
            })
        axios.get('/basic_master/get/print_technique')
            .then(function (response) {
                raw.data_print_technique = response.data
            })
            .catch(function (error) {
                console.log(error)
                raw.$buefy.snackbar.open({
                    duration: 4000,
                    message: 'Unable to fetch data for Print Technique',
                    type: 'is-light',
                    position: 'is-top-right',
                    actionText: 'Close',
                    queue: true,
                    onAction: () => {
                        this.isActive = false;
                    }
                })
            })
        axios.get('/basic_master/get/design_number')
            .then(function (response) {
                raw.data_design_number = response.data
            })
            .catch(function (error) {
                console.log(error)
                raw.$buefy.snackbar.open({
                    duration: 4000,
                    message: 'Unable to fetch data for Design Number',
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
            })
            .catch(function (error) {
                console.log(error)
                raw.$buefy.snackbar.open({
                    duration: 4000,
                    message: 'Unable to fetch data for Uom',
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
        autocompleteProductCategory() {

            if (this.data_product_category.length != 0) {
                return this.data_product_category.filter((option) => {
                    return option.name
                        .toString()
                        .toLowerCase()
                        .indexOf(this.form.product_category.toLowerCase()) >= 0
                })
            }
        },
        autocompleteSize() {

            if (this.data_size.length != 0) {
                return this.data_size.filter((option) => {
                    return option.name
                        .toString()
                        .toLowerCase()
                        .indexOf(this.form.size.toLowerCase()) >= 0
                })
            }
        },
        autocompleteFabricCombination() {

            if (this.data_fabric_combination.length != 0) {
                return this.data_fabric_combination.filter((option) => {
                    return option.name
                        .toString()
                        .toLowerCase()
                        .indexOf(this.form.fabric_combination.toLowerCase()) >= 0
                })
            }
        },
        autocompletePrintTechnique() {

            if (this.data_print_technique.length != 0) {
                return this.data_print_technique.filter((option) => {
                    return option.name
                        .toString()
                        .toLowerCase()
                        .indexOf(this.form.print_technique.toLowerCase()) >= 0
                })
            }
        },
        autocompleteDesignNumber() {

            if (this.data_design_number.length != 0) {
                return this.data_design_number.filter((option) => {
                    return option.name
                        .toString()
                        .toLowerCase()
                        .indexOf(this.form.design_number.toLowerCase()) >= 0
                })
            }
        },
        autocompleteUom() {

            if (this.data_uom.length != 0) {
                return this.data_uom.filter((option) => {
                    return option.name
                        .toString()
                        .toLowerCase()
                        .indexOf(this.form.uom.toLowerCase()) >= 0
                })
            }
        },
    },
    methods: {
        showAddData(val) {
            let self = this
            this.$buefy.dialog.prompt({
                message: `<b>Add Data</b> `,
                inputAttrs: {
                    placeholder: 'e.g. SKD',
                    maxlength: 20,
                    value: this.name
                },
                confirmText: 'Add',
                onConfirm: (value) => {

                    let formdata = { 'name': value }
                    axios
                        .post('/basic_master/add/' + String(val), formdata)
                        .then(function (response) {

                            if (response.data.success) {
                                switch (val) {
                                    case 'product_category':
                                        self.data_product_category.push(response.data.data)
                                        break;
                                    case 'fabric_combination':
                                        self.data_fabric_combination.push(response.data.data)
                                        break;
                                    case 'print_technique':
                                        self.data_print_technique.push(response.data.data)
                                        break;
                                    case 'design_number':
                                        self.data_design_number.push(response.data.data)
                                        break;
                                    case 'uom':
                                        self.data_uom.push(response.data.data)
                                        break;
                                    case 'size':
                                        self.data_size.push(response.data.data)
                                        break;

                                    default:
                                        break;
                                }
                                self.$buefy.snackbar.open({
                                    duration: 4000,
                                    message: response.data.success,
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
                                if (response.data.message) {
                                    self.$buefy.snackbar.open({
                                        duration: 4000,
                                        message: response.data.message,
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


                        })
                        .catch(function (error) {
                            console.log(error)
                        })

                }
            })
        },
        getProductCategory(option) {
            if (option != null) {
                this.formID.product_category = option.id
            }
            else {
                this.formID.product_category = null
            }
        },
        getFabricCombination(option) {
            if (option != null) {
                this.formID.fabric_combination = option.id
            }
            else {
                this.formID.fabric_combination = null
            }
        },
        getSize(option) {
            if (option != null) {
                this.formID.size = option.id
            }
            else {
                this.formID.size = null
            }
        },
        getDesignNumber(option) {
            if (option != null) {
                this.formID.design_number = option.id
            }
            else {
                this.formID.design_number = null
            }
        },
        getPrintTechnique(option) {
            if (option != null) {
                this.formID.print_technique = option.id
            }
            else {
                this.formID.print_technique = null
            }
        },
        getUom(option) {
            if (option != null) {
                this.formID.uom = option.id
            }
            else {
                this.formID.uom = null
            }
        },
        getEditProductCategory(option) {
            if (option != null) {
                this.editID.product_category = option.id
            }
            else {
                this.editID.product_category = null
            }
        },
        getEditFabricCombination(option) {
            if (option != null) {
                this.editID.fabric_combination = option.id
            }
            else {
                this.editID.fabric_combination = null
            }
        },
        getEditDesignNumber(option) {
            if (option != null) {
                this.editID.design_number = option.id
            }
            else {
                this.editID.design_number = null
            }
        },
        getEditPrintTechnique(option) {
            if (option != null) {
                this.editID.print_technique = option.id
            }
            else {
                this.editID.print_technique = null
            }
        },
        getEditUom(option) {
            if (option != null) {
                this.editID.uom = option.id
            }
            else {
                this.editID.uom = null
            }
        },
        getEditSize(option) {
            if (option != null) {
                this.editID.size = option.id
            }
            else {
                this.editID.size = null
            }
        },
        getData(event) {
            let raw = this;

            axios
                .get('/main_master/get/finished_goods')
                .then(function (response) {
                    console.log(response);
                    raw.data = response['data']

                })
                .catch(function (error) {
                    console.log(error)
                });

            event.preventDefault();

        },
        getStatic(filedata) {
            if (this.data[filedata].image != null) {
                let fileSrc = String('\\static') + String(this.data[filedata].image).split('\static')[1]
                return fileSrc
            }
            else {
                return null
            }
        },
        checkData(e) {
            this.form.errors = {}

            if (this.formID.product_category && this.formID.fabric_combination && this.formID.print_technique && this.formID.design_number && this.formID.uom  && this.formID.size) {
                return true;
            }
            if (!this.formID.product_category) {
                this.$set(this.form.errors, 'product_category', true)
            }
            if (!this.formID.fabric_combination) {
                this.$set(this.form.errors, 'fabric_combination', true)
            }
            if (!this.formID.print_technique) {
                this.$set(this.form.errors, 'print_technique', true)
            }
            if (!this.formID.design_number) {
                this.$set(this.form.errors, 'design_number', true)
            }
            if (!this.formID.uom) {
                this.$set(this.form.errors, 'uom', true)
            }
            if (!this.formID.size) {
                this.$set(this.form.errors, 'size', true)
            }


        },
        checkEditData(e) {
            this.errors = {}

            if (this.editID.product_category && this.editID.fabric_combination && this.editID.print_technique && this.editID.design_number && this.editID.uom && this.editID.size) {
                return true;
            }
            if (!this.editID.product_category || !this.editID.fabric_combination || !this.editID.print_technique || !this.editID.design_number || !this.editID.uom || !this.editID.size) {
                this.edit.errors.push('Data required');
            }

        },
        resetFields() {
            this.form.product_category = '';
            this.form.fabric_combination = '';
            this.form.print_technique = '';
            this.form.design_number = '';
            this.form.uom = '';
            this.form.size = '';
            this.formID.uom = null;
            this.formID.product_category = null;
            this.formID.fabric_combination = null;
            this.formID.print_technique = null;
            this.formID.design_number = null;
            this.formID.alt_name = null;
            this.formID.image = null;
            this.formID.size = null;

        },
        submitData(e) {

            var raw = this;

            if (this.checkData()) {
                let formData = new FormData()
                formData.append('data', JSON.stringify(this.formID))
                formData.append('image', this.formID.image)
                axios
                    .post('/main_master/add/finished_goods', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                    .then(function (response) {

                        if (response.data.success) {

                            raw.resetFields()
                            raw.removeImage()
                            raw.$buefy.snackbar.open({
                                duration: 4000,
                                message: response.data.success,
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
                            if (response.data.message) {
                                raw.$buefy.snackbar.open({
                                    duration: 4000,
                                    message: response.data.message,
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


                    })
                    .catch(function (error) {
                        console.log(error)
                    })
            }
            e.preventDefault();
        },
        deleteData(data, index) {

            let dataList = this.data;
            let raw = this
            axios
                .post('/main_master/delete/finished_goods', data)
                .then(function (response) {
                    if (response.data.success) {
                        dataList.splice(index, 1)
                        raw.$buefy.snackbar.open({
                            duration: 4000,
                            message: response.data.success,
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
                        raw.$buefy.snackbar.open({
                            duration: 4000,
                            message: response.data.message,
                            type: 'is-light',
                            position: 'is-top-right',
                            actionText: 'Close',
                            queue: true,
                            onAction: () => {
                                this.isActive = false;
                            }
                        })
                    }
                })
                .catch(function (error) {
                    console.log(error)
                })
        },
        viewBig(index) {

            this.fileSrc = this.getStatic(index)
            if (this.fileSrc != null) {

                this.viewUpload = !this.viewUpload

            }


        },
        editData(data, index) {
            this.edit.errors = []
            this.modal = true
            this.editID.id = data.id
            this.edit.image = data.image
            this.edit.index = index
            this.editID.alt_name = data.alt_name

            this.edit.product_category = data.product_category[0].name
            this.editID.product_category = data.product_category[0].id

            this.edit.fabric_combination = data.fabric_combination[0].name
            this.editID.fabric_combination = data.fabric_combination[0].id

            this.edit.print_technique = data.print_technique[0].name
            this.editID.print_technique = data.print_technique[0].id

            this.edit.design_number = data.design_number[0].name
            this.editID.design_number = data.design_number[0].id

            this.edit.uom = data.uom[0].name
            this.editID.uom = data.uom[0].id
         
            this.edit.size = data.size[0].name
            this.editID.size = data.size[0].id

        },
        saveEditData(event) {
            const raw = this;
            let dataList = this.data;
            if (this.checkEditData()) {
                let formData = new FormData()
                formData.append('data', JSON.stringify(this.editID))
                formData.append('image', this.editID.image)

                axios
                    .post('/main_master/edit/finished_goods', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                    .then(function (response) {
                        console.log(response.data.success)

                        if (response.data.success) {
                            dataList = raw.data.filter(function (x) { return x.id === raw.editID.id })
                            console.log(dataList)
                            var reader = new FileReader();
                            dataList[0].design_number[0].name = raw.edit.design_number
                            dataList[0].product_category[0].name = raw.edit.product_category
                            dataList[0].fabric_combination[0].name = raw.edit.fabric_combination
                            dataList[0].print_technique[0].name = raw.edit.print_technique
                            dataList[0].design_number[0].name = raw.edit.design_number
                            dataList[0].alt_name = raw.editID.alt_name

                            dataList[0].size[0].name = raw.edit.size
                            dataList[0].size[0].id = raw.editID.size
                            
                            dataList[0].uom[0].name = raw.edit.uom
                            dataList[0].uom[0].id = raw.editID.uom
                            
                            raw.modal = !raw.modal;

                            raw.$buefy.snackbar.open({
                                duration: 4000,
                                message: response.data.success,
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
                            if (response.data.message) {
                                raw.$buefy.snackbar.open({
                                    duration: 4000,
                                    message: response.data.message,
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


                    })
                    .catch(function (error) {
                        console.log(error)
                    })
                return true;

            }

            event.preventDefault();

        },
        removeImage() {
            this.form.image = null
            this.formID.image = null
            this.edit.image = null
            this.editID.image = null
            this.$refs.imageUpload.removeImage();

        },
        getLastRow() {
            let raw = this
            axios.get('/main_master/get/finished_goods/last')
                .then(function (response) {
                    data = response.data
                    console.log(data)
                    console.log(data.product_category[0].id)


                    raw.formID.alt_name = data.alt_name

                    raw.form.fabric_combination = data.fabric_combination[0].name
                    raw.formID.fabric_combination = data.fabric_combination[0].id

                    raw.form.print_technique = data.print_technique[0].name
                    raw.formID.print_technique = data.print_technique[0].id

                    raw.form.design_number = data.design_number[0].name
                    raw.formID.design_number = data.design_number[0].id

                    raw.form.uom = data.uom[0].name
                    raw.formID.uom = data.uom[0].id
                   
                    raw.form.size = data.size[0].name
                    raw.formID.size = data.size[0].id

                    raw.form.product_category = data.product_category[0].name
                    raw.formID.product_category = Number(data.product_category[0].id)
                })
        }
    }

})