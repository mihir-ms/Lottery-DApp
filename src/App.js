import React, {Component} from 'react';
import './App.css';
import web3 from './web3';
import Button from 'react-bootstrap/lib/Button';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Form from 'react-bootstrap/lib/Form';
import FormControl from 'react-bootstrap/lib/FormControl';
import {abi, address} from './contract';

let contract;
class App extends Component {

    state = {
        message1 : '',
        isMetaMask: false,
        value : 0,
    };

    async componentDidMount() {

        if (typeof window.web3 !== 'undefined') {
            console.log('web3 is enabled');
            if (web3.currentProvider.isMetaMask === true) {
                await this.setState({isMetaMask: true});
                console.log('MetaMask is active');
            } else {
                console.log('MetaMask is not available')
            }
        } else {
            console.log('web3 is not found')
        }

        if (this.state.isMetaMask) {
            contract = new web3.eth.Contract(abi, address);
        }
    }

 
    submitParticipate = async (event) => {
        event.preventDefault();

        const value = this.state.value;
        const accounts = await web3.eth.getAccounts();

        await(contract.methods.participate().send({
            "from":accounts[0],
            "value": web3.utils.toWei(value),
        })
        );
    }

    CallLuckyDraw = async (event) => {
        event.preventDefault();
        const accounts = await web3.eth.getAccounts();
        try {
            await(contract.methods.luckyDraw().send({
            "from":accounts[0],
            
        }));
            alert("Hooray Lucky!")
  //          a = await contract.methods.participantsAddresses[0]
            console.log()
            //currentAuctionAddress = await icoManagerContract.methods.currentAuction().call();
        } catch (err) {
            console.log(err);
        }

    }

    CallWithDraw = async (event) => {
        event.preventDefault();
        const accounts = await web3.eth.getAccounts();
        try {
            await(contract.methods.withdrawFund().send({
            "from":accounts[0],
            
        }));
            alert("Hooray withdraw!")
            //currentAuctionAddress = await icoManagerContract.methods.currentAuction().call();
        } catch (err) {
            console.log(err);
        }

    }

    getOwnerAddress = async (event) => {
        event.preventDefault();

        let ownerAddress = '0x';

        try {
            ownerAddress = await contract.methods.owner().call();
            alert(ownerAddress);
            //currentAuctionAddress = await icoManagerContract.methods.currentAuction().call();
        } catch (err) {
            console.log(err);
        }

        //this.setState({message1: 'Current auction address fetched successfully : ' + currentAuctionAddress});
    };

    render() {

        if (this.state.isMetaMask) {
            return (
                <div className="App">
                    <div className="Border">
                        <h2>Ethereum Dapp</h2>

                        <h2 className="display-1 text-muted">{this.state.message1}</h2>

                        <Form inline onSubmit={this.submitParticipate}>
                            <FormGroup>
                                <FormControl
                                    type="text"
                                    name="value"
                                    placeholder="enter value in ether"
                                    value={this.state.value}
                                    onChange={event => this.setState({value: event.target.value})}/>
                                </FormGroup>
                            <FormGroup>
                                <Button bsSize="large" bsStyle="warning" type="submit">
                                    Participate
                                </Button>
                            </FormGroup>
                        </Form>

                        <br/>
                        <hr width="100"/>

                        <Button bsSize="large" bsStyle="info" onClick={this.getOwnerAddress}>View Owner Address</Button>
                        <br/><br/>
                        <Button bsSize="large" bsStyle="info" onClick={this.CallLuckyDraw}>Luck Draw</Button>

                        <br/><br/>
                        <Button bsSize="large" bsStyle="info" onClick={this.CallWithDraw}>With Draw</Button>
                        <br/><br/>

                        <hr width="100"/>


                    </div>

                    <br/><br/>

                </div>
            );
        } else {
            return (
                <div className="App">
                    <h2>You are using a decentralized application, for which you need metamask</h2>
                    <br/><br/><br/><br/><br/>
                    <a href="https://metamask.io">
                        <img src="download-metamask-dark.png"></img>
                    </a>
                </div>
            );
        }
    }
}

export default App;
