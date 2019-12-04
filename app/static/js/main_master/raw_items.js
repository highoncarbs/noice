new Vue({
    el: '#raw_items_master',
    data() {
        return {
            form: {
                yarn: '',
                fabric_process: '',
                fabric_width: '',
                fabric_dye: '',
                raw_material_category: '',
                fabric_construction: '',
            },
            formID: {
                yarn: null,
                fabric_process: null,
                fabric_width: null,
                fabric_dye: null,
                raw_material_category: null,
                fabric_construction: null,
                alt_name: null,
                image: null
            },
            edit: {
                yarn: null,
                fabric_process: null,
                fabric_width: null,
                fabric_dye: null,
                raw_material_category: null,
                fabric_construction: null,
                image: null
            },
            editID: {
                yarn: null,
                fabric_process: null,
                fabric_width: null,
                fabric_dye: null,
                raw_material_category: null,
                fabric_construction: null,
                alt_name: null,
                image: null,
                id: null
            },
            data_yarn: [],
            data_fabric_process: [],
            data_fabric_width: [],
            data_fabric_dye: [],
            data_raw_material_category: [],
            data_fabric_construction: [],
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
        axios.get('/basic_master/get/yarn')
            .then(function (response) {
                raw.data_yarn = response.data
            })
            .catch(function (error) {
                console.log(error)
                raw.$buefy.snackbar.open({
                    duration: 4000,
                    message: 'Unable to fetch data for Yarn',
                    type: 'is-light',
                    position: 'is-top-right',
                    actionText: 'Close',
                    queue: true,
                    onAction: () => {
                        this.isActive = false;
                    }
                })
            })
        axios.get('/basic_master/get/fabric_process')
            .then(function (response) {
                raw.data_fabric_process = response.data
            })
            .catch(function (error) {
                console.log(error)
                raw.$buefy.snackbar.open({
                    duration: 4000,
                    message: 'Unable to fetch data for Fabric Process',
                    type: 'is-light',
                    position: 'is-top-right',
                    actionText: 'Close',
                    queue: true,
                    onAction: () => {
                        this.isActive = false;
                    }
                })
            })
        axios.get('/basic_master/get/fabric_width')
            .then(function (response) {
                raw.data_fabric_width = response.data
            })
            .catch(function (error) {
                console.log(error)
                raw.$buefy.snackbar.open({
                    duration: 4000,
                    message: 'Unable to fetch data for Fabric Width',
                    type: 'is-light',
                    position: 'is-top-right',
                    actionText: 'Close',
                    queue: true,
                    onAction: () => {
                        this.isActive = false;
                    }
                })
            })
        axios.get('/basic_master/get/raw_material_category')
            .then(function (response) {
                raw.data_raw_material_category = response.data
            })
            .catch(function (error) {
                console.log(error)
                raw.$buefy.snackbar.open({
                    duration: 4000,
                    message: 'Unable to fetch data for Raw Material Category',
                    type: 'is-light',
                    position: 'is-top-right',
                    actionText: 'Close',
                    queue: true,
                    onAction: () => {
                        this.isActive = false;
                    }
                })
            })
        axios.get('/basic_master/get/fabric_dye')
            .then(function (response) {
                raw.data_fabric_dye = response.data
            })
            .catch(function (error) {
                console.log(error)
                raw.$buefy.snackbar.open({
                    duration: 4000,
                    message: 'Unable to fetch data for Fabric Dye',
                    type: 'is-light',
                    position: 'is-top-right',
                    actionText: 'Close',
                    queue: true,
                    onAction: () => {
                        this.isActive = false;
                    }
                })
            })
        axios.get('/basic_master/get/fabric_construction')
            .then(function (response) {
                raw.data_fabric_construction = response.data
            })
            .catch(function (error) {
                console.log(error)
                raw.$buefy.snackbar.open({
                    duration: 4000,
                    message: 'Unable to fetch data for Fabric Construction',
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
        autocompleteYarn() {

            if (this.data_yarn.length != 0) {
                return this.data_yarn.filter((option) => {
                    return option.name
                        .toString()
                        .toLowerCase()
                        .indexOf(this.form.yarn.toLowerCase()) >= 0
                })
            }
        },
        autocompleteFabricProcess() {

            if (this.data_fabric_process.length != 0) {
                return this.data_fabric_process.filter((option) => {
                    return option.name
                        .toString()
                        .toLowerCase()
                        .indexOf(this.form.fabric_process.toLowerCase()) >= 0
                })
            }
        },
        autocompleteFabricWidth() {

            if (this.data_fabric_width.length != 0) {
                return this.data_fabric_width.filter((option) => {
                    return option.name
                        .toString()
                        .toLowerCase()
                        .indexOf(this.form.fabric_width.toLowerCase()) >= 0
                })
            }
        },
        autocompleteRawMaterialCategory() {

            if (this.data_raw_material_category.length != 0) {
                return this.data_raw_material_category.filter((option) => {
                    return option.name
                        .toString()
                        .toLowerCase()
                        .indexOf(this.form.raw_material_category.toLowerCase()) >= 0
                })
            }
        },
        autocompleteFabricDye() {

            if (this.data_fabric_dye.length != 0) {
                return this.data_fabric_dye.filter((option) => {
                    return option.name
                        .toString()
                        .toLowerCase()
                        .indexOf(this.form.fabric_dye.toLowerCase()) >= 0
                })
            }
        },
        autocompleteFabricConstruction() {

            if (this.data_fabric_construction.length != 0) {
                return this.data_fabric_construction.filter((option) => {
                    return option.name
                        .toString()
                        .toLowerCase()
                        .indexOf(this.form.fabric_construction.toLowerCase()) >= 0
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
                    placeholder: 'Enter Value',
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
                                    case 'yarn':
                                        self.data_yarn.push(response.data.data)
                                        break;
                                    case 'fabric_process':
                                        self.data_fabric_process.push(response.data.data)
                                        break;
                                    case 'fabric_width':
                                        self.data_fabric_width.push(response.data.data)
                                        break;
                                    case 'fabric_dye':
                                        self.data_fabric_dye.push(response.data.data)
                                        break;
                                    case 'raw_material_category':
                                        self.data_raw_material_category.push(response.data.data)
                                        break;
                                    case 'fabric_construction':
                                        self.data_fabric_construction.push(response.data.data)
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
        getYarn(option) {
            if (option != null) {
                this.formID.yarn = option.id
            }
            else {
                this.formID.yarn = null
            }
        },
        getFabricProcess(option) {
            if (option != null) {
                this.formID.fabric_process = option.id
            }
            else {
                this.formID.fabric_process = null
            }
        },
        getRawMaterialCategory(option) {
            if (option != null) {
                this.formID.raw_material_category = option.id
            }
            else {
                this.formID.raw_material_category = null
            }
        },
        getFabricWidth(option) {
            if (option != null) {
                this.formID.fabric_width = option.id
            }
            else {
                this.formID.fabric_width = null
            }
        },
        getFabricDye(option) {
            if (option != null) {
                this.formID.fabric_dye = option.id
            }
            else {
                this.formID.fabric_dye = null
            }
        },
        getFabricConstruction(option) {
            if (option != null) {
                this.formID.fabric_construction = option.id
            }
            else {
                this.formID.fabric_construction = null
            }
        },
        getEditYarn(option) {
            if (option != null) {
                this.editID.yarn = option.id
            }
            else {
                this.editID.yarn = null
            }
        },
        getEditFabricProcess(option) {
            if (option != null) {
                this.editID.fabric_process = option.id
            }
            else {
                this.editID.fabric_process = null
            }
        },
        getEditFabricDye(option) {
            if (option != null) {
                this.editID.raw_material_category = option.id
            }
            else {
                this.editID.raw_material_category = null
            }
        },
        getEditFabricWidth(option) {
            if (option != null) {
                this.editID.fabric_width = option.id
            }
            else {
                this.editID.fabric_width = null
            }
        },
        getEditRawMaterialCategory(option) {
            if (option != null) {
                this.editID.fabric_width = option.id
            }
            else {
                this.editID.fabric_width = null
            }
        },
        getEditFabricConstruction(option) {
            if (option != null) {
                this.editID.fabric_dye = option.id
            }
            else {
                this.editID.fabric_dye = null
            }
        },
        getData(event) {
            let raw = this;

            axios
                .get('/main_master/get/raw_goods')
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
            this.errors = {}

            if (this.formID.yarn && this.formID.fabric_process && this.formID.fabric_width && this.formID.raw_material_category && this.formID.fabric_dye && this.formID.fabric_construction) {
                return true;
            }
            if (!this.formID.yarn || !this.formID.fabric_process || !this.formID.fabric_width || !this.formID.raw_material_category || !this.formID.fabric_dye || !this.formID.fabric_construction) {
                this.form.errors.push('Data required');
            }

        },
        checkEditData(e) {
            this.errors = {}

            if (this.editID.yarn && this.editID.fabric_process && this.editID.fabric_width && this.editID.raw_material_category && this.editID.fabric_dye && this.editID.fabric_construction) {
                return true;
            }
            if (!this.editID.yarn || !this.editID.fabric_process || !this.editID.fabric_width || !this.editID.raw_material_category || !this.editID.fabric_dye || !this.editID.fabric_construction) {
                this.edit.errors.push('Data required');
            }

        },
        resetFields() {
            this.form.yarn = '';
            this.form.fabric_process = '';
            this.form.fabric_width = '';
            this.form.raw_material_category = '';
            this.form.fabric_dye = '';
            this.form.fabric_construction = '';
            this.formID.fabric_dye = null;
            this.formID.yarn = null;
            this.formID.fabric_process = null;
            this.formID.fabric_width = null;
            this.formID.raw_material_category = null;
            this.formID.fabric_construction = null;
            this.formID.alt_name = null;
            this.formID.image = null;

        },
        submitData(e) {

            var raw = this;

            if (this.checkData()) {
                let formData = new FormData()
                formData.append('data', JSON.stringify(this.formID))
                formData.append('image', this.formID.image)
                axios
                    .post('/main_master/add/raw_goods', formData, {
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
                .post('/main_master/delete/raw_goods', data)
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

            this.edit.yarn = data.yarn[0].name
            this.editID.yarn = data.yarn[0].id

            this.edit.fabric_process = data.fabric_process[0].name
            this.editID.fabric_process = data.fabric_process[0].id

            this.edit.fabric_width = data.fabric_width[0].name
            this.editID.fabric_width = data.fabric_width[0].id

            this.edit.raw_material_category = data.raw_material_category[0].name
            this.editID.raw_material_category = data.raw_material_category[0].id

            this.edit.fabric_dye = data.fabric_dye[0].name
            this.editID.fabric_dye = data.fabric_dye[0].id

            this.edit.fabric_construction = data.fabric_construction[0].name
            this.editID.fabric_construction = data.fabric_construction[0].id

        },
        saveEditData(event) {
            const raw = this;
            let dataList = this.data;
            if (this.checkEditData()) {
                let formData = new FormData()
                formData.append('data', JSON.stringify(this.editID))
                formData.append('image', this.editID.image)

                axios
                    .post('/main_master/edit/raw_goods', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                    .then(function (response) {
                        console.log(response.data.success)

                        if (response.data.success) {
                            dataList = raw.data.filter(function (x) { return x.id === raw.editID.id })

                            dataList[0].fabric_dye[0].name = raw.edit.fabric_dye
                            dataList[0].fabric_construction[0].name = raw.edit.fabric_construction
                            dataList[0].yarn[0].name = raw.edit.yarn
                            dataList[0].fabric_process[0].name = raw.edit.fabric_process
                            dataList[0].fabric_width[0].name = raw.edit.fabric_width
                            dataList[0].raw_material_category[0].name = raw.edit.raw_material_category
                            dataList[0].alt_name = raw.editID.alt_name
                            raw.modal = !raw.modal;
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
            this.$refs.imageUploadSlim.removeImage();

        },
        getLastRow() {
            let raw = this
            axios.get('/main_master/get/raw_goods/last')
                .then(function (response) {
                    data = response.data

                    raw.formID.alt_name = data.alt_name

                    raw.form.fabric_process = data.fabric_process[0].name
                    raw.formID.fabric_process = data.fabric_process[0].id

                    raw.form.fabric_width = data.fabric_width[0].name
                    raw.formID.fabric_width = data.fabric_width[0].id

                    raw.form.raw_material_category = data.raw_material_category[0].name
                    raw.formID.raw_material_category = data.raw_material_category[0].id

                    raw.form.fabric_dye = data.fabric_dye[0].name
                    raw.formID.fabric_dye = data.fabric_dye[0].id

                    raw.form.yarn = data.yarn[0].name
                    raw.formID.yarn = data.yarn[0].id

                    raw.form.fabric_construction = data.fabric_construction[0].name
                    raw.formID.fabric_construction = data.fabric_construction[0].id
                })
        }
    }

})