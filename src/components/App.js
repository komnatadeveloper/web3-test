import React, { Component } from 'react';
import logo from '../logo.png';
import './App.css';
import Web3 from 'web3';
import Marketplace from '../abis/Marketplace.json';
import Navbar from './Navbar';

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
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className='container-fluid mt-5'>
          <div className='row'>
            <main role='main' className='col-lg-12 d-flex text-center'>
              <div className='content mr-auto ml-auto'>
                <a
                  href='http://www.dappuniversity.com/bootcamp'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <img src={logo} className='App-logo' alt='logo' />
                </a>
                <h1>Dapp University Starter Kit</h1>
                <p>
                  Edit <code>src/components/App.js</code> and save to reload.
                </p>
                <a
                  className='App-link'
                  href='http://www.dappuniversity.com/bootcamp'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  LEARN BLOCKCHAIN{' '}
                  <u>
                    <b>NOW! </b>
                  </u>
                </a>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
