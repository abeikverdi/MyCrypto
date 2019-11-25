import React, { Component, createContext } from 'react';

import { ExtendedContract } from 'v2/types';
import * as service from './Contract';

export interface ProviderState {
  contracts: ExtendedContract[];
  createContract(contractsData: ExtendedContract): void;
  readContract(uuid: string): ExtendedContract;
  deleteContract(uuid: string): void;
  updateContract(uuid: string, contractsData: ExtendedContract): void;
}

export const ContractContext = createContext({} as ProviderState);

export class ContractProvider extends Component {
  public readonly state: ProviderState = {
    contracts: [],
    readContract: service.readContract,
    createContract: (contractsData: ExtendedContract) => {
      service.createContract(contractsData);
      this.getContracts();
    },
    deleteContract: (uuid: string) => {
      service.deleteContract(uuid);
      this.getContracts();
    },
    updateContract: (uuid: string, contractsData: ExtendedContract) => {
      service.updateContract(uuid, contractsData);
      this.getContracts();
    }
  };

  public render() {
    const { children } = this.props;
    return <ContractContext.Provider value={this.state}>{children}</ContractContext.Provider>;
  }

  // Set 'contracts' on first mount.
  public componentDidMount() {
    this.getContracts();
  }

  private getContracts = () => {
    const contracts = service.readContracts() || [];
    this.setState({ contracts });
  };
}
