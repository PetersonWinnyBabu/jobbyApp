import './index.css'

const SkillsItem = props => {
  const {eachSkillDetail} = props
  const {imageUrl, name} = eachSkillDetail
  return (
    <li className="skillItem">
      <img className="skillLOGO" src={imageUrl} alt={name} />
      <p className="skillName">{name}</p>
    </li>
  )
}

export default SkillsItem
