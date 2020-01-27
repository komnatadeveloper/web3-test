import React, { Component } from 'react';
import logo from '../logo.png';
import './App.css';
import Web3 from 'web3';
import Marketplace from '../abis/Marketplace.json';
import Navbar from './Navbar';
import Main from './Main';

class App extends Component {
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
    console.log(window.web3);
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        'Non-Ethereum browser detected. You should consider trying Metamask!'
      );
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    // Load account
    const accounts = await web3.eth.getAccounts();
    // console.log(accounts);
    this.setState({ account: accounts[0] });
    // console.log(Marketplace.abi, Marketplace.networks[5777].address);
    // const networkId = await web3.eth.net.gedId(); // THIS RESULTS ERROR
    // console.log(networkId);
    // const networkData = Marketplace.networks[networkId]; // THIS RESULTS ERROR
    const networkData = Marketplace.networks[5777];
    if (networkData) {
      // const abi = Marketplace.abi;
      // const address = Marketplace.networks[networkId].address;
      const marketplace = web3.eth.Contract(
        Marketplace.abi,
        networkData.address
      );
      this.setState({ marketplace });
      const productCount = await marketplace.methods.productCount().call();
      this.setState({ loading: false });
      console.log(marketplace);
    } else {
      window.alert('Marketplace contraact not deployed to deteceted network');
    }
    // console.log(marketplace);
  }

  constructor(props) {
    super(props);
    this.state = {
      account: '',
      productCount: 0,
      products: [],
      loading: true
    };

    this.createProduct = this.createProduct.bind(this);
  }

  createProduct(name, price) {
    this.setState({ loading: true });
    this.state.marketplace.methods
      .createProduct(name, price)
      .send({ from: this.state.account })
      .once('receipt', receipt => {
        this.setState({ loading: false });
      });
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className='container-fluid mt-5'>
          <div className='row'>
            <main role='main' className='col-lg-12 d-flex'>
              {this.state.loading ? (
                <div id='loader' className='text-center'>
                  Loading...
                </div>
              ) : (
                <Main createProduct={this.createProduct} />
              )}
              {/* <Main /> */}
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
