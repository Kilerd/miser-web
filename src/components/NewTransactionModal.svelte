<script>
    export let isOpen;
    export let toggle;
    import {Modal, ModalHeader, ModalFooter, ModalBody, Button} from "sveltestrap/src"
    import Datepicker from 'svelte-calendar';
    import AutoComplete from "simple-svelte-autocomplete";


    const colorList = [
        {id: 1, name: "White", code: "#FFFFFF"},
        {id: 2, name: "Red", code: "#FF0000"},
        {id: 3, name: "Yellow", code: "#FF00FF"},
        {id: 4, name: "Green", code: "#00FF00"},
        {id: 5, name: "Blue", code: "#0000FF"},
        {id: 6, name: "Black", code: "#000000"}
    ];
    let selectedColor;

    async function getItems(keyword) {
        return [
            ...colorList,
            {id: 999, name: keyword, code: "new"}
        ]
    }

</script>

<Modal isOpen={isOpen} centered={true} fade={true} backdrop={false} size="lg" {toggle}>
    <ModalHeader {toggle}>New Transaction</ModalHeader>
    <ModalBody>
        <Datepicker dateChosen={true} formattedSelected="today"/>
        <AutoComplete labelFieldName="name" valueFieldName="code" bind:selectedItem={selectedColor}
                      searchFunction={getItems}/>
        {`${selectedColor?.name} ${selectedColor?.code}`}
    </ModalBody>
    <ModalFooter>
        <Button color="primary" on:click={toggle}>Create</Button>
        <Button color="secondary" on:click={toggle}>Cancel</Button>
    </ModalFooter>
</Modal>