import {Component} from 'react'

import Cookies from 'js-cookie'

import {BsSearch} from 'react-icons/bs'

import Loader from 'react-loader-spinner'

import Header from '../Header'

import JobItem from '../JobItem'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusVariables = {
  initial: 'INITIAL',
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Jobs extends Component {
  state = {
    profileData: {},
    jobListData: [],
    checkedFilters: [],

    minimumPackage: 0,
    searchText: '',
    apiStatus: apiStatusVariables.initial,
    profileApiStatus: apiStatusVariables.initial,
    noJobs: false,
  }

  componentDidMount() {
    this.setState({})
    this.getProfileData()
    this.getJobListData()
  }

  getUpdatedJob = jobData => ({
    companyLogoUrl: jobData.company_logo_url,
    employmentType: jobData.employment_type,
    id: jobData.id,
    jobDescription: jobData.job_description,
    location: jobData.location,
    packagePerAnnum: jobData.package_per_annum,
    rating: jobData.rating,
    title: jobData.title,
  })

  onSuccessApiCall = data => {
    const jobsList = data.jobs
    const updatedJobsList = jobsList.map(eachjob => this.getUpdatedJob(eachjob))
    if (updatedJobsList.length !== 0) {
      this.setState({
        jobListData: updatedJobsList,
        noJobs: false,
        apiStatus: apiStatusVariables.success,
      })
    } else {
      this.setState({noJobs: true})
    }
  }

  onfailureApiCall = () => {
    this.setState({apiStatus: apiStatusVariables.failure})
  }

  onSearchTextChange = event => {
    this.setState({searchText: event.target.value})
  }

  handleCheckbox = event => {
    if (event.target.checked) {
      this.setState(
        prevState => ({
          checkedFilters: [...prevState.checkedFilters, event.target.value],
        }),
        this.getJobListData,
      )
    } else {
      this.setState(
        prevState => ({
          checkedFilters: prevState.checkedFilters.filter(
            eachFilter => eachFilter !== event.target.value,
          ),
        }),
        this.getJobListData,
      )
    }
  }

  handleRadioInput = event => {
    if (event.target.checked) {
      this.setState({minimumPackage: event.target.value}, this.getJobListData)
    }
  }

  getProfileData = async () => {
    this.setState({profileApiStatus: apiStatusVariables.loading})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const profileresponse = await fetch(url, options)
    const responsedata = await profileresponse.json()
    if (profileresponse.ok) {
      const profileDetails = responsedata.profile_details
      const updatedProfileData = {
        name: profileDetails.name,
        profileImageUrl: profileDetails.profile_image_url,
        shortBio: profileDetails.short_bio,
      }
      this.setState({
        profileData: updatedProfileData,
        profileApiStatus: apiStatusVariables.success,
      })
    } else {
      this.setState({profileApiStatus: apiStatusVariables.failure})
    }
  }

  getJobListData = async () => {
    this.setState({apiStatus: apiStatusVariables.loading})
    const {checkedFilters, searchText, minimumPackage} = this.state
    const employmentType = checkedFilters.join(',')

    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentType}&minimum_package=${minimumPackage}&search=${searchText}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok) {
      this.onSuccessApiCall(data)
    } else {
      this.onfailureApiCall()
    }
  }

  renderloader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderErrorItem = () => (
    <div className="errorItem">
      <img
        className="errorimage"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1 className="errorHeading">Oops! Something Went Wrong</h1>
      <p className="errorpara">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        className="retryButton"
        type="button"
        onClick={this.getJobListData}
      >
        Retry
      </button>
    </div>
  )

  renderButton = () => (
    <div className="userprofileInfo">
      <button
        className="retryButton"
        type="button"
        onClick={this.getProfileData}
      >
        Retry
      </button>
    </div>
  )

  renderNoJobs = () => (
    <div className="errorItem">
      <img
        className="errorimage"
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
      />
      <h1 className="errorHeading">No Jobs Found</h1>
      <p className="errorpara">We could not find any jobs. Try other filters</p>
    </div>
  )

  renderItems = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusVariables.loading:
        return this.renderloader()
      case apiStatusVariables.success:
        return this.renderjobList()
      case apiStatusVariables.failure:
        return this.renderErrorItem()
      default:
        return null
    }
  }

  renderProfileItem = () => {
    const {profileApiStatus} = this.state
    switch (profileApiStatus) {
      case apiStatusVariables.loading:
        return this.renderloader()
      case apiStatusVariables.success:
        return this.renderPRofile()
      case apiStatusVariables.failure:
        return this.renderButton()
      default:
        return null
    }
  }

  renderjobList = () => {
    const {jobListData} = this.state
    return (
      <ul className="jobsList">
        {jobListData.map(eachJOb => (
          <JobItem key={eachJOb.id} jobData={eachJOb} />
        ))}
      </ul>
    )
  }

  renderPRofile = () => {
    const {profileData} = this.state
    const {name, profileImageUrl, shortBio} = profileData
    return (
      <div className="userprofileInfo">
        <img className="profileimage" src={profileImageUrl} alt="profile" />
        <h1 className="profileName">{name}</h1>
        <p className="shortBio">{shortBio}</p>
      </div>
    )
  }

  render() {
    const {searchText, minimumPackage, noJobs} = this.state
    console.log(minimumPackage)

    return (
      <div className="jobbackground">
        <Header />
        <div className="jobFiltersAndList">
          <div className="filtersSection">
            {this.renderProfileItem()}
            <hr className="hrline" />

            <div className="typesofEmployement">
              <h1 className="filterheading">Type of Employment</h1>
              <ul className="filters">
                {employmentTypesList.map(eachtype => (
                  <li
                    className="filterlistitem"
                    key={eachtype.employmentTypeId}
                  >
                    <input
                      type="checkbox"
                      className="checkboxinput"
                      value={eachtype.employmentTypeId}
                      id={eachtype.label}
                      onChange={this.handleCheckbox}
                    />
                    <label className="filterlabels" htmlFor={eachtype.label}>
                      {eachtype.label}
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            <hr className="hrline" />

            <div className="typesofEmployement">
              <h1 className="filterheading">Salary Range</h1>
              <ul className="filters">
                {salaryRangesList.map(eachRange => (
                  <li className="filterlistitem" key={eachRange.salaryRangeId}>
                    <input
                      type="radio"
                      name="salary"
                      className="checkboxinput"
                      value={eachRange.salaryRangeId}
                      id={eachRange.label}
                      onChange={this.handleRadioInput}
                    />
                    <label className="filterlabels" htmlFor={eachRange.label}>
                      {eachRange.label}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="jobListContainer">
            <div className="searchBoxContainer">
              <input
                type="search"
                className="searchBox"
                value={searchText}
                placeholder="Search"
                onChange={this.onSearchTextChange}
              />
              <button
                data-testid="searchButton"
                className="searchbutton"
                type="button"
                onClick={this.getJobListData}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {noJobs ? this.renderNoJobs() : this.renderItems()}
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
